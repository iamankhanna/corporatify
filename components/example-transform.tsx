export function ExampleTransform() {
  return (
    <div className="animate-slide-up rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
      <p className="text-xs uppercase tracking-[0.3em] text-moss">
        Before and after
      </p>
      <h2 className="mt-4 text-3xl leading-tight text-ink">
        Users should feel the transformation immediately
      </h2>

      <div className="mt-8 grid gap-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-black/45">
            What they typed
          </p>
          <p className="mt-3 text-sm leading-7 text-black/70">
            This process is ridiculous. I keep getting bounced around and no one
            seems to know what they are doing.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-700/20 bg-slate-800 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            What they can send
          </p>
          <p className="mt-3 text-sm leading-7 text-white/75">
            I would appreciate some clarity on the current process, as I have
            received different guidance so far. A more consistent point of
            contact would be very helpful.
          </p>
        </div>
      </div>
    </div>
  );
}
