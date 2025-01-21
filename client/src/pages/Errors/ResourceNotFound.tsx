export default function NotFound({ resourceName, url }: { resourceName?: string; url?: string }) {
  return <div>
    <h3 className="text-lg">{resourceName ?? "Resource"} not found: {url ? <strong>{url}</strong> : ""}</h3>
  </div>
}