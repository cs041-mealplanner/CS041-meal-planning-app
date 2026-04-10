const authImageUrl = new URL("../../assets/images/left-mealpic.png", import.meta.url).href;

export default function AuthPageLayout({
  children,
  formWidth = "max-w-md",
  showImage = true,
}) {
  if (!showImage) {
    return (
      <div className="flex w-full min-h-[calc(100vh-11.25rem)] items-center justify-center bg-[#E8E3D8] px-6 py-8 lg:px-10">
        <div className={`w-full ${formWidth}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-h-[calc(100vh-11.25rem)] bg-[#E8E3D8] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="h-full w-full overflow-hidden">
          <img
            src={authImageUrl}
            alt="Healthy meal planning"
            className="absolute left-1/2 top-1/2 h-[118%] w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_38%]"
          />
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-8 lg:px-10">
        <div className={`w-full ${formWidth}`}>{children}</div>
      </div>
    </div>
  );
}
