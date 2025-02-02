import React from "react";

const HeroBgSvg = () => {
  return (
    <div>
      <svg
        width="1920"
        height="1080"
        // className="h-[100vh] w-[100vw]"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
          </filter>
          <mask
            id="mask0_515_415"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1920"
            height="1080"
          >
            <rect width="1920" height="1080" fill="white" />
          </mask>
          <filter
            id="filter0_f_515_415"
            x="-292.499"
            y="-149.335"
            width="2514.39"
            height="1597.54"
          >
            <feGaussianBlur stdDeviation="112.5" />
          </filter>
          <filter
            id="filter1_f_515_415"
            x="-567.499"
            y="-424.335"
            width="3064.39"
            height="2147.54"
          >
            <feGaussianBlur stdDeviation="250" />
          </filter>
          <filter
            id="filter2_f_515_415"
            x="-276.843"
            y="-29.0396"
            width="2393.73"
            height="1372.25"
          >
            <feGaussianBlur stdDeviation="60" />
          </filter>
          <filter
            id="filter3_f_515_415"
            x="-298.079"
            y="627.797"
            width="2514.56"
            height="1065.46"
          >
            <feGaussianBlur stdDeviation="100" />
          </filter>
          <filter
            id="filter4_f_515_415"
            x="177"
            y="473"
            width="1624"
            height="1020"
          >
            <feGaussianBlur stdDeviation="125" />
          </filter>
          <filter
            id="filter5_f_515_415"
            x="262"
            y="705"
            width="1416.63"
            height="820.927"
          >
            <feGaussianBlur stdDeviation="125" />
          </filter>
          <filter
            id="filter6_f_515_415"
            x="51"
            y="605"
            width="1743"
            height="1065"
          >
            <feGaussianBlur stdDeviation="175" />
          </filter>
        </defs>

        <g mask="url(#mask0_515_415)">
          <g filter="url(#filter0_f_515_415)">
            <path
              d="M1369.5 848C1236 796.5 986.001 747.5 841.501 749.5C771.501 749.5 603 768 490.5 796.5C390.767 821.766 248.5 767.5 192 688.5C135.5 609.5 42.5008 285.5 25.0008 209C7.50076 132.5 -32.4992 -0.999832 -53.9992 132.5C-84.4996 419 40.5003 651 40.5 811C40.4997 992.5 -113 1144 -53.9992 1207.5C-33.2386 1229.84 1989 1227 1995.5 1207.5C2002 1188 1984.5 277 1967 266C1949.5 255 1943 274.5 1941 327C1939 379.5 1937.93 618.212 1919 688.5C1894.5 779.5 1849.5 843 1751 897.5C1652.5 952 1483.83 892.103 1369.5 848Z"
              fill="#2515E1"
            />
          </g>
          <g
            style={{
              mixBlendMode: "screen",
              filter: "url(#filter1_f_515_415)",
            }}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M841.501 749.5C986.001 747.5 1236 796.5 1369.5 848C1483.83 892.103 1652.5 952 1751 897.5C1849.5 843 1894.5 779.5 1919 688.5C1934.43 631.191 1938 461.912 1939.87 372.895C1940.29 352.737 1940.63 336.694 1941 327C1943 274.5 1949.5 255 1967 266C1984.5 277 2002 1188 1995.5 1207.5C1989 1227 -33.2386 1229.84 -53.9992 1207.5C-83.984 1175.23 -59.0844 1120.23 -27.3417 1050.11C3.37514 982.263 40.4999 900.26 40.5 811C40.5001 749.259 21.8869 676.796 0.778154 594.618C-32.8155 463.835 -72.73 308.444 -53.9992 132.5C-32.4992 -0.999832 7.50076 132.5 25.0008 209C42.5008 285.5 135.5 609.5 192 688.5C248.5 767.5 390.767 821.766 490.5 796.5C603 768 771.501 749.5 841.501 749.5Z"
              fill="#5C53C6"
            />
          </g>
          <g
            style={{
              mixBlendMode: "screen",
              filter: "url(#filter2_f_515_415)",
            }}
          >
            <path
              d="M1369.5 848C1236 796.5 986.001 747.5 841.501 749.5C771.501 749.5 603 768 490.5 796.5C390.767 821.766 248.5 767.5 192 688.5C135.5 609.5 18.5001 287.5 1.00011 211C-16.4999 134.5 -132.5 18.5001 -154 152C-184.5 438.5 40.5004 651 40.5001 811C40.4998 992.5 -113 1144 -53.9991 1207.5C-33.2385 1229.84 1989 1227 1995.5 1207.5C2002 1188 1984.5 277 1967 266C1949.5 255 1943 274.5 1941 327C1939 379.5 1937.93 618.213 1919 688.5C1894.5 779.5 1849.5 843 1751 897.5C1652.5 952 1483.83 892.103 1369.5 848Z"
              fill="#7B15E1"
            />
          </g>
          <g filter="url(#filter3_f_515_415)">
            <path
              d="M2016.41 1227.13C2011.34 1407.61 1649.56 1508.79 1026.54 1491.32C403.527 1473.84 -161.28 1425.94 -92.3622 1132.88C-41.045 1031.6 80.7743 925.853 224.45 879.902C454.972 806.176 770.132 828.993 1153.94 839.758C1776.95 857.234 2021.47 1046.64 2016.41 1227.13Z"
              fill="#5348D2"
            />
          </g>
          <g filter="url(#filter4_f_515_415)">
            <path
              d="M491.267 866.279C383.972 996.713 409.723 1170.09 578.329 1177.38C647.202 1177.38 815.236 1180.46 936.387 1192.77C1087.83 1208.16 1293.04 1243 1396.22 1243C1515.16 1243 1646.37 1096.84 1451.4 915.698C1294.44 769.87 1215.35 957.826 1125.23 946.484C1035.1 935.142 1061.46 908.407 948.036 793.365C834.61 678.323 623.496 705.532 491.267 866.279Z"
              fill="#2D1DE8"
            />
          </g>
          <g
            style={{
              mixBlendMode: "screen",
              opacity: 0.88,
            }}
          >
            <g filter="url(#filter5_f_515_415)">
              <path
                d="M564.41 1043.43C476.91 1123.93 497.91 1230.93 635.41 1235.43C691.577 1235.43 828.61 1237.33 927.41 1244.93C1050.91 1254.43 1218.26 1275.93 1302.41 1275.93C1399.41 1275.93 1506.41 1185.72 1347.41 1073.93C1219.41 983.927 1154.91 1099.93 1081.41 1092.93C1007.91 1085.93 1029.41 1069.43 936.91 998.427C844.41 927.427 672.245 944.219 564.41 1043.43Z"
                fill="#E81DBB"
              />
            </g>
            <g filter="url(#filter6_f_515_415)">
              <path
                d="M460.635 1055.57C361.073 1147.13 384.968 1268.82 541.423 1273.94C605.333 1273.94 761.258 1276.1 873.678 1284.74C1014.2 1295.55 1204.63 1320 1300.37 1320C1410.75 1320 1532.5 1217.41 1351.58 1090.26C1205.93 987.899 1132.54 1119.83 1048.91 1111.87C965.276 1103.91 989.74 1085.14 884.488 1004.39C779.236 923.64 583.336 942.739 460.635 1055.57Z"
                fill="#DE14B2"
              />
            </g>
          </g>
        </g>
        {/* <!-- Noise layer on top --> */}
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

export default HeroBgSvg;
