const LOCAL_STORAGE_VIEW_KEY = "view";

export function setView(view: "preview" | "builder"): void {
  localStorage.setItem(LOCAL_STORAGE_VIEW_KEY, view);
}

export function getView(): "preview" | "builder" {
  return (
    (localStorage.getItem(LOCAL_STORAGE_VIEW_KEY) as "preview" | "builder") ||
    "builder"
  );
}
