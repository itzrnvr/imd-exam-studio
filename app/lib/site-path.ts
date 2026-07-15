const basePath = (process.env.NEXT_PUBLIC_APP_BASE_PATH ?? "").replace(/\/$/, "");

export function sitePath(path: string): string {
  if (!basePath) return path;
  return path === "/" ? `${basePath}/` : `${basePath}${path}`;
}

export function appPathname(pathname: string): string {
  if (!basePath || !pathname.startsWith(basePath)) return pathname;
  const stripped = pathname.slice(basePath.length);
  return stripped || "/";
}
