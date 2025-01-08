import Link from "next/link";
export default function Home() {
  return (
<div className="bg-black bg-home-img bg-cover bg-center">
  <main className="flex flex-col justify-center text-center max-w-5xl max-auto h-dvh">
    <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/70 w-4/5 size-max-w-96 mx-auto text-white sm:text-2xl">
      <h1 className="text-3xl font-bold">
        Pouria Mirsadegh <br /> Software Developer
      </h1>
      <address>
        170 Torbay Road<br /> 
        St. Johns, Newfoundland and Labrador <br /> 
        Canada, A1A 2H3
      </address>
      <p>
        Open to work Monday to Friday 8am to 5pm!
      </p>
      <Link href="tell: 1-709-770-8105" className="hover:underline"></Link>
      709-770-8105
    </div>
  </main>
</div>
  );
}