import Image, { type StaticImageData } from "next/image";

interface Props {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function PosterFallback({ src, alt, width, height, priority }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
