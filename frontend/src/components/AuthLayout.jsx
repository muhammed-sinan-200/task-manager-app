const AuthLayout = ({ imageSrc, imageAlt, children }) => {
  return (
    <div className="flex h-svh min-h-0 flex-col overflow-x-hidden bg-[#F7F8F4] md:flex-row dark:bg-stone-950">
      <aside className="relative hidden shrink-0 overflow-hidden md:block md:h-auto md:w-[38%] lg:w-1/2">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#4D7C0F]/50 via-[#4D7C0F]/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 hidden p-6 md:block lg:p-8 xl:p-10">
          <p className="text-sm font-semibold tracking-wide text-[#d9f99d]">
            Task Manager
          </p>
          <p className="mt-1.5 hidden max-w-sm text-xl font-semibold tracking-tight text-white lg:mt-2 lg:block lg:text-2xl">
            Stay on top of your work with a calm, focused task workspace.
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-8 md:w-[62%] md:px-8 md:py-6 lg:w-1/2 lg:px-12 xl:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#d9f99d] opacity-35 dark:bg-[#4D7C0F]/15 dark:opacity-100 lg:opacity-60"
        />
        <div className="relative my-auto w-full max-w-md self-center py-2">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
