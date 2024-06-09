// import React from "react";
// import Text from "../ui/Text";
// import { Button } from "../ui/Button";
// import Link from "next/link";

// const SingleProduct = () => {
//   return (
//     <Link href={`/product/storage1`} className="flex flex-col gap-5 w-[360px]">
//       <img src={"/products/product.png"} />
//       <div className="flex flex-col gap-1">
//         <Text variant="shortHeadings" className="text-[#EAEAEA]">
//           Kitchen Cabinets
//         </Text>
//         <Text className="text-[#9A9A9A]">
//           cial Kitchen Equipment Market Leaders in Custom Industrial-Grade
//           Commercial cial Kitchen Equipment Market Leaders in Custom
//           Industrial-Grade Commercial Kitchen Eq
//         </Text>
//       </div>
//       <Button variant="productbtn">Get A Custom Quote</Button>
//     </Link>
//   );
// };

// export default SingleProduct;

import React from "react";
import Text from "../ui/Text";
import { Button } from "../ui/Button";
import Link from "next/link";

interface SingleProductProps {
  href: string;
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({
  href,
  imageSrc,
  title,
  description,
  buttonText,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col base:gap-5 md:justify-between md:w-[min(19vw,360px)] md:h-[min(23vw,427px)]"
    >
      <img src={imageSrc} alt={title} />
      <div className="flex flex-col gap-1">
        <Text variant="shortHeadings" className="text-[#EAEAEA]">
          {title}
        </Text>
        <Text className="text-[#9A9A9A] line-clamp-3">{description}</Text>
      </div>
      <Button variant="productbtn">{buttonText}</Button>
    </Link>
  );
};

export default SingleProduct;
