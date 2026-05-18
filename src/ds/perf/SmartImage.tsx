import Image, { type ImageProps } from "next/image";

interface SmartImageProps extends ImageProps {
  // Force consumers to specify sizes — protects against unbounded responsive images.
  sizes: string;
}

export function SmartImage({ alt, sizes, ...rest }: SmartImageProps) {
  return <Image alt={alt} sizes={sizes} {...rest} />;
}
