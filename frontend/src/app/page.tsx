export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="z-10 max-w-5xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4 sm:text-5xl">
            World Cup Experience
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Book your trip with Altair Logistics
          </p>
          <a
            href="/#book"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-500"
          >
            Book now
          </a>
        </div>
      </section>
      <section id="book" className="min-h-[50vh] px-4 py-16" />
      <section id="experience" className="min-h-[40vh] px-4 py-16" />
      <section id="packages" className="min-h-[40vh] px-4 py-16" />
      <section id="contact" className="min-h-[40vh] px-4 py-16" />
    </main>
  );
}
