export default function LoginBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#FF0033]/10 blur-[120px]" />
      <div className="absolute -bottom-48 -right-32 h-112.5 w-112.5 rounded-full bg-[#FF0033]/[0.07] blur-[130px]" />

      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(#FFFFFF_1px,transparent_1px),linear-gradient(90deg,#FFFFFF_1px,transparent_1px)] bg-size-[40px_40px]" />
    </div>
  );
}
