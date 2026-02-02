// import { Button } from "@/components/ui/button";
// import {
//   Airplay,
//   BabyIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CloudLightning,
//   Heater,
//   Images,
//   Shirt,
//   ShirtIcon,
//   ShoppingBasket,
//   UmbrellaIcon,
//   WashingMachine,
//   WatchIcon,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { useNavigate } from "react-router-dom";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "@/components/ui/use-toast";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import { getFeatureImages } from "@/store/common-slice";

// const categoriesWithIcon = [
//   { id: "office", label: "Office", icon: ShirtIcon },
//   { id: "kitchen", label: "Kitchen", icon: CloudLightning },
//   { id: "gifts", label: "Gifts", icon: BabyIcon },
//   { id: "accessories", label: "Accessories", icon: WatchIcon },
//   { id: "home", label: "Home", icon: UmbrellaIcon },
// ];

// function ShoppingHome() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const productList = useSelector((state) => state.shopProducts?.productList) || [];
//   const productDetails = useSelector((state) => state.shopProducts?.productDetails) || null;
//   const featureImageListFromStore = useSelector((state) => state.commonFeature?.featureImageList);
//   const featureImageList = useMemo(() => featureImageListFromStore || [], [featureImageListFromStore]);

//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

//   const user = useSelector((state) => state.auth?.user) || null;

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   function handleNavigateToListingPage(getCurrentItem, section) {
//     sessionStorage.removeItem("filters");
//     const currentFilter = {
//       [section]: [getCurrentItem.id],
//     };

//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));
//     navigate(`/shop/listing`);
//   }

//   function handleGetProductDetails(getCurrentProductId) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId) {
//     if (!user?.id) return; // avoid crash if user is not logged in

//     dispatch(
//       addToCart({
//         userId: user.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   useEffect(() => {
//     if (featureImageList.length > 0) {
//       const timer = setInterval(() => {
//         setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
//       }, 15000);

//       return () => clearInterval(timer);
//     }
//   }, [featureImageList]);

//   useEffect(() => {
//     dispatch(
//       fetchAllFilteredProducts({
//         filterParams: {},
//         sortParams: "price-lowtohigh",
//       })
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="relative w-full h-[600px] overflow-hidden">
//         {featureImageList.length > 0 &&
//           featureImageList.map((slide, index) => (
//             <img
//               src={slide?.image}
//               key={index}
//               className={`${
//                 index === currentSlide ? "opacity-100" : "opacity-0"
//               } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
//               alt={`slide-${index}`}
//             />
//           ))}
//         {featureImageList.length > 0 && (
//           <>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() =>
//                 setCurrentSlide(
//                   (prevSlide) =>
//                     (prevSlide - 1 + featureImageList.length) %
//                     featureImageList.length
//                 )
//               }
//               className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
//             >
//               <ChevronLeftIcon className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() =>
//                 setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
//               }
//               className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
//             >
//               <ChevronRightIcon className="w-4 h-4" />
//             </Button>
//           </>
//         )}
//       </div>

//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             {categoriesWithIcon.map((categoryItem) => (
//               <Card
//                 key={categoryItem.id}
//                 onClick={() => handleNavigateToListingPage(categoryItem, "category")}
//                 className="cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
//                   <span className="font-bold">{categoryItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {brandsWithIcon.map((brandItem) => (
//               <Card
//                 key={brandItem.id}
//                 onClick={() => handleNavigateToListingPage(brandItem, "brand")}
//                 className="cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
//                   <span className="font-bold">{brandItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {productList.length > 0
//               ? productList.map((productItem) => (
//                   <ShoppingProductTile
//                     key={productItem._id}
//                     handleGetProductDetails={handleGetProductDetails}
//                     product={productItem}
//                     handleAddtoCart={handleAddtoCart}
//                   />
//                 ))
//               : <p className="text-center col-span-full">No Products Available</p>}
//           </div>
//         </div>
//       </section>

//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingHome;




// // import { Button } from "@/components/ui/button";
// // import bannerOne from "../../assets/banner-1.webp";
// // import bannerTwo from "../../assets/banner-2.webp";
// // import bannerThree from "../../assets/banner-3.webp";
// // import {
// //   Airplay,
// //   BabyIcon,
// //   ChevronLeftIcon,
// //   ChevronRightIcon,
// //   CloudLightning,
// //   Heater,
// //   Images,
// //   Shirt,
// //   ShirtIcon,
// //   ShoppingBasket,
// //   UmbrellaIcon,
// //   WashingMachine,
// //   WatchIcon,
// // } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchAllFilteredProducts,
// //   fetchProductDetails,
// // } from "@/store/shop/products-slice";
// // import ShoppingProductTile from "@/components/shopping-view/product-tile";
// // import { useNavigate } from "react-router-dom";
// // import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// // import { useToast } from "@/components/ui/use-toast";
// // import ProductDetailsDialog from "@/components/shopping-view/product-details";
// // import { getFeatureImages } from "@/store/common-slice";

// // const categoriesWithIcon = [
// //   { id: "office", label: "Office", icon: ShirtIcon },
// //   { id: "kitchen", label: "Kitchen", icon: CloudLightning },
// //   { id: "gifts", label: "Gifts", icon: BabyIcon },
// //   { id: "accessories", label: "Accessories", icon: WatchIcon },
// //   { id: "home", label: "Home", icon: UmbrellaIcon },
// // ];

// // function ShoppingHome() {
// //   const [currentSlide, setCurrentSlide] = useState(0);
// //   const { productList, productDetails } = useSelector(
// //     (state) => state.shopProducts
// //   );
// //   const { featureImageList } = useSelector((state) => state.commonFeature);

// //   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

// //   const { user } = useSelector((state) => state.auth);

// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { toast } = useToast();

// //   function handleNavigateToListingPage(getCurrentItem, section) {
// //     sessionStorage.removeItem("filters");
// //     const currentFilter = {
// //       [section]: [getCurrentItem.id],
// //     };

// //     sessionStorage.setItem("filters", JSON.stringify(currentFilter));
// //     navigate(`/shop/listing`);
// //   }

// //   function handleGetProductDetails(getCurrentProductId) {
// //     dispatch(fetchProductDetails(getCurrentProductId));
// //   }

// //   function handleAddtoCart(getCurrentProductId) {
// //     dispatch(
// //       addToCart({
// //         userId: user?.id,
// //         productId: getCurrentProductId,
// //         quantity: 1,
// //       })
// //     ).then((data) => {
// //       if (data?.payload?.success) {
// //         dispatch(fetchCartItems(user?.id));
// //         toast({
// //           title: "Product is added to cart",
// //         });
// //       }
// //     });
// //   }

// //   useEffect(() => {
// //     if (productDetails !== null) setOpenDetailsDialog(true);
// //   }, [productDetails]);

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
// //     }, 15000);

// //     return () => clearInterval(timer);
// //   }, [featureImageList]);

// //   useEffect(() => {
// //     dispatch(
// //       fetchAllFilteredProducts({
// //         filterParams: {},
// //         sortParams: "price-lowtohigh",
// //       })
// //     );
// //   }, [dispatch]);

// //   console.log(productList, "productList");

// //   useEffect(() => {
// //     dispatch(getFeatureImages());
// //   }, [dispatch]);

// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <div className="relative w-full h-[600px] overflow-hidden">
// //         {featureImageList && featureImageList.length > 0
// //           ? featureImageList.map((slide, index) => (
// //               <img
// //                 src={slide?.image}
// //                 key={index}
// //                 className={`${
// //                   index === currentSlide ? "opacity-100" : "opacity-0"
// //                 } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
// //               />
// //             ))
// //           : null}
// //         <Button
// //           variant="outline"
// //           size="icon"
// //           onClick={() =>
// //             setCurrentSlide(
// //               (prevSlide) =>
// //                 (prevSlide - 1 + featureImageList.length) %
// //                 featureImageList.length
// //             )
// //           }
// //           className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
// //         >
// //           <ChevronLeftIcon className="w-4 h-4" />
// //         </Button>
// //         <Button
// //           variant="outline"
// //           size="icon"
// //           onClick={() =>
// //             setCurrentSlide(
// //               (prevSlide) => (prevSlide + 1) % featureImageList.length
// //             )
// //           }
// //           className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
// //         >
// //           <ChevronRightIcon className="w-4 h-4" />
// //         </Button>
// //       </div>
// //       <section className="py-12 bg-gray-50">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center mb-8">
// //             Shop by category
// //           </h2>
// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
// //             {categoriesWithIcon.map((categoryItem) => (
// //               <Card
// //                 onClick={() =>
// //                   handleNavigateToListingPage(categoryItem, "category")
// //                 }
// //                 className="cursor-pointer hover:shadow-lg transition-shadow"
// //               >
// //                 <CardContent className="flex flex-col items-center justify-center p-6">
// //                   <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
// //                   <span className="font-bold">{categoryItem.label}</span>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 bg-gray-50">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
// //             {brandsWithIcon.map((brandItem) => (
// //               <Card
// //                 onClick={() => handleNavigateToListingPage(brandItem, "brand")}
// //                 className="cursor-pointer hover:shadow-lg transition-shadow"
// //               >
// //                 <CardContent className="flex flex-col items-center justify-center p-6">
// //                   <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
// //                   <span className="font-bold">{brandItem.label}</span>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center mb-8">
// //             Feature Products
// //           </h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //             {productList && productList.length > 0
// //               ? productList.map((productItem) => (
// //                   <ShoppingProductTile
// //                     handleGetProductDetails={handleGetProductDetails}
// //                     product={productItem}
// //                     handleAddtoCart={handleAddtoCart}
// //                   />
// //                 ))
// //               : null}
// //           </div>
// //         </div>
// //       </section>
// //       <ProductDetailsDialog
// //         open={openDetailsDialog}
// //         setOpen={setOpenDetailsDialog}
// //         productDetails={productDetails}
// //       />
// //     </div>
// //   );
// // }

// // export default ShoppingHome;


import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

/* ================= STATIC HERO IMAGES ================= */
const heroImages = [
  { image: "/hero/slider1.jpg" },
  { image: "/hero/slider2.jpg" },
  { image: "/hero/slider3.jpg" },
];

/* ================= CATEGORIES ================= */
const categoriesWithIcon = [
  { id: "office", label: "Office", icon: ShirtIcon },
  { id: "kitchen", label: "Kitchen", icon: CloudLightning },
  { id: "gifts", label: "Gifts", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "home", label: "Home", icon: UmbrellaIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const productList =
    useSelector((state) => state.shopProducts?.productList) || [];
  const productDetails =
    useSelector((state) => state.shopProducts?.productDetails) || null;
  const user = useSelector((state) => state.auth?.user) || null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ================= HANDLERS ================= */
  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem(
      "filters",
      JSON.stringify({ [section]: [item.id] })
    );
    navigate("/shop/listing");
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId) {
    if (!user?.id) return;

    dispatch(
      addToCart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {heroImages.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            alt={`hero-${index}`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + heroImages.length) % heroImages.length
            )
          }
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
          }
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center p-6">
                  <item.icon className="w-12 h-12 mb-3 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.length > 0 ? (
              productList.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center">
                No Products Available
              </p>
            )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
