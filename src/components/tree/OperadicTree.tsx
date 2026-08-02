import { useMemo, useState, useCallback } from "react";
import { QUESTION_TREE, flattenLeaves, type TreeNode } from "@/data/question-tree";
import { EXAM_BANK, type ExamItem } from "@/data/exam-bank";
import { DOMAIN_META, type DomainId } from "@/data/scenarios";
import { evaluateItem } from "@/lib/exam/adversarial";
import { cn } from "@/lib/utils";
import { ChevronDown, GitBranch, Target, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

function DomainDot({ domain }: { domain?: DomainId }) {
  if (!domain) return null;
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ background: DOMAIN_META[domain].color }}
      aria-hidden
    />
  );
}

function NodeCard({
  node,
  depth,
  selected,
  onSelect,
  expanded,
  onToggle,
}: {
  node: TreeNode;
  depth: number;
  selected: string | null;
  onSelect: (id: string) => void;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasKids = (node.children?.length ?? 0) > 0;
  const isOpen = expanded.has(node.id);
  const isSel = selected === node.id;

  return (
    <div className="relative" style={{ marginLeft: depth === 0 ? 0 : 12 }}>
      {depth > 0 && (
        <span
          className="absolute -left-3 top-0 bottom-0 w-px bg-[var(--color-line)]"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "group mb-2 rounded-[var(--radius)] border transition-all duration-200",
          isSel
            ? "border-[var(--color-ink)] bg-[var(--color-surface-2)] shadow-[var(--shadow-card)]"
            : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-ink)]/20",
        )}
      >
        <div className="flex items-start gap-2 p-3">
          {hasKids ? (
            <button
              type="button"
              onClick={() => onToggle(node.id)}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)]"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-[var(--color-muted)] transition-transform duration-200",
                  isOpen ? "rotate-0" : "-rotate-90",
                )}
              />
            </button>
          ) : (
            <span className="mt-1.5 ml-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
          )}
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex flex-wrap items-center gap-2">
              <DomainDot domain={node.domain} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                {node.kind}
                {node.weight != null ? ` · ${node.weight}%` : ""}
                {node.taskId ? ` · TS ${node.taskId}` : ""}
              </span>
            </div>
            <p
              className={cn(
                "mt-0.5 leading-snug text-[var(--color-ink)]",
                node.kind === "domain" || node.kind === "root"
                  ? "font-[family-name:var(--font-display)] text-base font-semibold"
                  : "text-sm font-medium",
              )}
            >
              {node.label}
            </p>
            {node.detail && (
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                {node.detail}
              </p>
            )}
            {node.antiPattern && (
              <p className="mt-1.5 text-xs text-[var(--color-danger)]">
                Anti-pattern: {node.antiPattern}
              </p>
            )}
          </button>
        </div>
      </div>
      {hasKids && isOpen && (
        <div className="border-l border-[var(--color-line)] pl-3">
          {node.children!.map((c) => (
            <NodeCard
              key={c.id}
              node={c}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OperadicTree() {
  const [selected, setSelected] = useState<string>("root");
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["root", "D1", "D2", "D3", "D4", "D5"]),
  );
  const [drillLeaf, setDrillLeaf] = useState<TreeNode | null>(null);
  const [drillItem, setDrillItem] = useState<ExamItem | null>(null);
  const [pick, setPick] = useState<number | null>(null);

  const leaves = useMemo(() => flattenLeaves(), []);

  function toggle(id: string) {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function find(id: string, node: TreeNode = QUESTION_TREE): TreeNode | null {
    if (node.id === id) return node;
    for (const c of node.children ?? []) {
      const f = find(id, c);
      if (f) return f;
    }
    return null;
  }

  const sel = find(selected);

  const randomLeafDrill = useCallback(() => {
    const withItems = leaves.filter((l) => (l.itemIds?.length ?? 0) > 0);
    if (withItems.length === 0) return;
    const leaf = withItems[Math.floor(Math.random() * withItems.length)]!;
    const itemId = leaf.itemIds![Math.floor(Math.random() * leaf.itemIds!.length)]!;
    const item = EXAM_BANK.find((q) => q.id === itemId) ?? null;
    setDrillLeaf(leaf);
    setDrillItem(item);
    setPick(null);
    setSelected(leaf.id);
    setExpanded((prev) => {
      const n = new Set(prev);
      n.add(leaf.id);
      if (leaf.domain) n.add(leaf.domain);
      return n;
    });
  }, [leaves]);

  const drillReport = drillItem ? evaluateItem(drillItem) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-soft)]">
            <GitBranch className="h-3 w-3" />
            {leaves.length} competency leaves
          </span>
          <button
            type="button"
            onClick={randomLeafDrill}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold text-[var(--color-paper)] transition-transform duration-150 active:scale-[0.96]"
          >
            <Zap className="h-3 w-3" />
            Random leaf drill
          </button>
        </div>
        <NodeCard
          node={QUESTION_TREE}
          depth={0}
          selected={selected}
          onSelect={setSelected}
          expanded={expanded}
          onToggle={toggle}
        />
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink)] p-5 text-[var(--color-paper)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper)]/50">
            Selected node
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug">
            {sel?.label ?? "—"}
          </h2>
          {sel?.detail && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-paper)]/75">
              {sel.detail}
            </p>
          )}
          {sel?.weight != null && (
            <p className="mt-3 font-mono text-xs text-[var(--color-paper)]/55">
              Blueprint weight {sel.weight}% · composition factor in root AND
            </p>
          )}
        </div>

        {drillItem && drillReport && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-sm font-semibold">Leaf stress test</p>
              <span className="ml-auto font-mono text-[10px] text-[var(--color-muted)]">
                eval {drillReport.score}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-[var(--color-muted)]">
              {drillLeaf?.id} → {drillItem.id}
              {drillItem.officialSample ? " · official sample" : ""}
            </p>
            <p className="mt-3 text-sm font-medium leading-snug">{drillItem.stem}</p>
            <div className="mt-3 space-y-1.5">
              {drillItem.options.map((o, i) => {
                const show = pick !== null;
                const ok = i === drillItem.correctIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={pick !== null}
                    onClick={() => setPick(i)}
                    className={cn(
                      "w-full rounded-md border px-2.5 py-2 text-left text-xs",
                      !show && "border-[var(--color-line)] hover:border-[var(--color-ink)]/30",
                      show && ok && "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/40",
                      show &&
                        pick === i &&
                        !ok &&
                        "border-[var(--color-danger)] bg-[var(--color-danger-soft)]/40",
                    )}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {pick !== null && (
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                {drillItem.explanation}
              </p>
            )}
            <button
              type="button"
              onClick={randomLeafDrill}
              className="mt-4 text-xs font-semibold text-[var(--color-accent)]"
            >
              Another random leaf →
            </button>
          </div>
        )}

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink-soft)]">
          <p className="font-semibold text-[var(--color-ink)]">How to use the tree</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed">
            <li>Expand domains proportional to weight (D1 is 27%).</li>
            <li>Read the anti-pattern on each leaf — the exam loves those traps.</li>
            <li>Run random leaf drills until explanations feel automatic.</li>
            <li>
              Graduate to the{" "}
              <Link to="/exam" className="font-semibold text-[var(--color-accent)]">
                scenario exam
              </Link>{" "}
              for 4-of-6 randomized forms.
            </li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
