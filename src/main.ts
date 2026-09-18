import type { ViewContext, TextSnapshot } from "@eidos.space/plugin-sdk"
import { Transformer } from "markmap-lib"
import { Markmap } from "markmap-view"
import "./style.css"

export default async function mount(ctx: ViewContext, root: HTMLElement) {
  if (ctx.binding.kind !== "document") {
    throw new Error("Markmap requires a Markdown document")
  }

  const file = ctx.binding.document
  const transformer = new Transformer()

  root.innerHTML = `
    <div class="markmap-root">
      <div class="markmap-badge" id="markmap-badge">
        <span class="markmap-badge-dot"></span>
        <span class="markmap-badge-title">Markmap</span>
        <span id="markmap-stat">0 nodes</span>
      </div>
      <div class="markmap-controls">
        <button class="markmap-btn" id="btn-fit" title="Fit to View">Fit</button>
        <div class="markmap-divider"></div>
        <button class="markmap-btn" id="btn-zoom-in" title="Zoom In">+</button>
        <button class="markmap-btn" id="btn-zoom-out" title="Zoom Out">-</button>
        <div class="markmap-divider"></div>
        <button class="markmap-btn" id="btn-expand" title="Expand All">Expand</button>
        <button class="markmap-btn" id="btn-collapse" title="Collapse All">Collapse</button>
      </div>
      <div class="markmap-empty" id="markmap-empty" style="display: none;">
        <svg class="markmap-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 3a3 3 0 0 0-3 3c0 .3.05.59.14.86l-4.29 2.5a3 3 0 0 0-1.85-.36 3 3 0 1 0 3 3c0-.3-.05-.59-.14-.86l4.29-2.5a3 3 0 0 0 1.85.36 3 3 0 0 0 1.85-.36l4.29 2.5c-.09.27-.14.56-.14.86a3 3 0 1 0 3-3 3 3 0 0 0-1.85.36l-4.29-2.5c.09-.27.14-.56.14-.86a3 3 0 0 0-3-3z"/>
        </svg>
        <h3 class="markmap-empty-title">No Markdown Content</h3>
        <p class="markmap-empty-desc">Start writing headings (# Heading) or lists (- item) to see your interactive mindmap appear here.</p>
      </div>
      <svg class="markmap-canvas" id="markmap-svg"></svg>
    </div>
  `

  const container = root.querySelector<HTMLElement>(".markmap-root")!
  const svgEl = root.querySelector<SVGElement>("#markmap-svg")!
  const emptyEl = root.querySelector<HTMLElement>("#markmap-empty")!
  const statEl = root.querySelector<HTMLElement>("#markmap-stat")!
  const btnFit = root.querySelector<HTMLButtonElement>("#btn-fit")!
  const btnZoomIn = root.querySelector<HTMLButtonElement>("#btn-zoom-in")!
  const btnZoomOut = root.querySelector<HTMLButtonElement>("#btn-zoom-out")!
  const btnExpand = root.querySelector<HTMLButtonElement>("#btn-expand")!
  const btnCollapse = root.querySelector<HTMLButtonElement>("#btn-collapse")!

  let mm: Markmap | null = null
  let currentRoot: any = null
  let wasEmpty = true

  function countNodes(node: any): number {
    if (!node) return 0
    let count = 1
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        count += countNodes(child)
      }
    }
    return count
  }

  function setFold(node: any, fold: number, minDepth: number, currentDepth = 0) {
    if (!node) return
    if (currentDepth >= minDepth) {
      node.payload = { ...node.payload, fold }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        setFold(child, fold, minDepth, currentDepth + 1)
      }
    }
  }

  function updateTheme() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      getComputedStyle(document.documentElement).colorScheme === "dark"
    container.classList.toggle("markmap-dark", isDark)
  }

  const themeObserver = new MutationObserver(updateTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"],
  })
  updateTheme()

  function render(text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      emptyEl.style.display = "flex"
      svgEl.style.display = "none"
      statEl.textContent = "0 nodes"
      wasEmpty = true
      return
    }

    try {
      const { root: rootData } = transformer.transform(text)
      currentRoot = rootData
      const totalNodes = countNodes(rootData)

      emptyEl.style.display = "none"
      svgEl.style.display = "block"
      statEl.textContent = `${totalNodes} node${totalNodes === 1 ? "" : "s"}`

      if (!mm) {
        mm = Markmap.create(
          svgEl,
          {
            embedGlobalCSS: true,
            fitRatio: 0.95,
            duration: 300,
          },
          rootData
        )
        requestAnimationFrame(() => mm?.fit())
      } else {
        mm.setData(rootData)
        if (wasEmpty) {
          requestAnimationFrame(() => mm?.fit())
        }
      }
      wasEmpty = false
    } catch (err) {
      console.error("Markmap parse error:", err)
    }
  }

  // Toolbar actions
  btnFit.addEventListener("click", () => mm?.fit(), { signal: ctx.signal })
  btnZoomIn.addEventListener("click", () => mm?.rescale(1.25), { signal: ctx.signal })
  btnZoomOut.addEventListener("click", () => mm?.rescale(0.8), { signal: ctx.signal })

  btnExpand.addEventListener("click", async () => {
    if (!mm || !currentRoot) return
    setFold(currentRoot, 0, 0)
    await mm.renderData(currentRoot)
    await mm.fit()
  }, { signal: ctx.signal })

  btnCollapse.addEventListener("click", async () => {
    if (!mm || !currentRoot) return
    setFold(currentRoot, 1, 1)
    await mm.renderData(currentRoot)
    await mm.fit()
  }, { signal: ctx.signal })

  // Observe container resize
  let resizeTimer: ReturnType<typeof setTimeout>
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (mm && !wasEmpty) {
        mm.fit()
      }
    }, 100)
  })
  resizeObserver.observe(root)

  // Observe document content changes
  let renderTimer: ReturnType<typeof setTimeout>
  const observed = await file.observe(
    (state: TextSnapshot) => {
      clearTimeout(renderTimer)
      renderTimer = setTimeout(() => render(state.text), 60)
    },
    (err: unknown) => {
      console.error("Document observe error:", err)
    }
  )
  ctx.subscriptions.add(observed.subscription)

  // Initial render with current document snapshot
  render(observed.snapshot.text)

  return {
    dispose() {
      clearTimeout(renderTimer)
      clearTimeout(resizeTimer)
      themeObserver.disconnect()
      resizeObserver.disconnect()
      if (mm) {
        mm.destroy()
        mm = null
      }
      root.replaceChildren()
    },
  }
}
