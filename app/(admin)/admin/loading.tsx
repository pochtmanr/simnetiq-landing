import { PageSkeleton } from "./components/States";

/* Shown the instant a tab is tapped, while the next screen's code loads —
   so a slow network never leaves the previous screen frozen on tap. */
export default function AdminLoading() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[1160px] px-[clamp(16px,3vw,28px)] pt-[70px] md:pt-[78px]">
      <PageSkeleton />
    </div>
  );
}
