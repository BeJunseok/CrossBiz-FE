import { cx } from "../../utils/cx";

export default function EventBars({ bars=[] }) {
  return (
    <div className="mt-1 pl-4 w-[60px] space-y-0.5">
      {bars.map((c, i) => (
        <span
          key={i}
          className={cx("block", c==="green" ? "bg-green-500" : "bg-[#D40000]/60")}
          style={{ height:"6px", width:"62%" }}
        />
      ))}
    </div>
  );
}