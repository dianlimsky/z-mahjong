export function EmptyState({ icon = '◌', title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-panel/60 px-5 py-10 text-center">
    <div className="mb-3 text-3xl text-gray-600" aria-hidden="true">{icon}</div>
    <p className="font-semibold text-gray-200">{title}</p>
    {description && <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
}
