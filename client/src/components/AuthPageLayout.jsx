const authImageUrl = new URL("../../assets/images/left-mealpic.png", import.meta.url).href;

export default function AuthPageLayout({ children, formWidth = "max-w-md" }) {
  return (
    <div className="bg-[#E8E3D8]">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-[1440px] items-center gap-8 px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,30rem)] lg:gap-20 lg:px-8">
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="h-[min(72vh,700px)] w-full overflow-hidden">
            <img
              src={authImageUrl}
              alt="Healthy meal planning"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className={`w-full ${formWidth}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
