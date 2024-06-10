"use client";

import AlertMessage from "@/components/shared/AlertMessage";
import {
  capitalizeFirstLetter,
  formatDate,
  isValidRemoteImage,
} from "@/libraries/utils";
import { useState, useEffect, useRef } from "react";
import Spinner from "@/ui/Spinners/White";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { ArrowLeftIcon, ChevronDownIcon, CloseIcon } from "@/icons";
import clsx from "clsx";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiImageOn } from "react-icons/ci";
import { CreateCollectionAction } from "@/actions/collections";
import Overlay from "@/ui/Overlay";
import { UpdatePageHeroAction } from "@/actions/page-hero";

type RequestDataType = {
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  collection_type: string;
  image?: string;
};

type PageHeroType = {
  id: string;
  image: string | null;
  title: string | null;
  destination_url: string | null;
  visibility: string;
};

export function PageHeroButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.editPageHero.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="flex flex-col items-start w-full min-[560px]:w-[calc(100%/2-4px)] min-[824px]:w-64 rounded-xl p-5 relative cursor-pointer ease-in-out duration-300 transition shadow border border-transparent bg-white active:border-[#bfc5ce] lg:hover:border-[#bfc5ce]"
    >
      <div className="w-full mb-4 flex items-center justify-between relative">
        <h2 className="text-left font-semibold text-sm">Page hero</h2>
        <div
          className={clsx(
            "relative w-10 h-5 rounded-full ease-in-out duration-200",
            {
              "bg-white border": false,
              "bg-custom-blue border border-custom-blue": true,
            }
          )}
        >
          <div
            className={clsx(
              "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)]",
              {
                "left-[5px] bg-black": false,
                "left-[23px] bg-white": true,
              }
            )}
          ></div>
        </div>
      </div>
      <p className="w-52 text-left text-gray text-xs leading-[18px]">
        The first thing visitors notice. Use visuals that make a strong first
        impression.
      </p>
    </button>
  );
}

export function PageHeroOverlay({ pageHero }: { pageHero: PageHeroType }) {
  const HIDDEN = "HIDDEN";
  const VISIBLE = "VISIBLE";

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState<string>(pageHero.title || "");
  const [visibility, setVisibility] = useState<string>(pageHero.visibility);
  const [destinationUrl, setDestinationUrl] = useState<string>(
    pageHero.destination_url || ""
  );
  const [image, setImage] = useState<string>(pageHero.image || "");

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.editPageHero.name,
      isOverlayVisible: state.pages.storefront.overlays.editPageHero.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible || showAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      if (!isOverlayVisible && !showAlert) {
        document.body.style.overflow = "visible";
      }
    };
  }, [isOverlayVisible, showAlert]);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (visibility === "VISIBLE" && (!title || !image || !destinationUrl)) {
        let errorMessage = "";

        if (!title) {
          errorMessage = "Please provide the title";
        } else if (!image) {
          errorMessage = "Please provide the image";
        } else if (!destinationUrl) {
          errorMessage = "Please provide the destination URL";
        }
        setAlertMessage(errorMessage);
        setShowAlert(true);
      } else {
        const message = await UpdatePageHeroAction({
          id: pageHero.id,
          title: title,
          image: image,
          destination_url: destinationUrl,
          visibility: visibility,
        });
        setAlertMessage(message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage("Error updating page hero");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setTitle(pageHero.title || "");
    setDestinationUrl(pageHero.destination_url || "");
    setImage(pageHero.image || "");
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <>
      {isOverlayVisible && (
        <Overlay>
          <div className="absolute bottom-0 left-0 right-0 w-full h-[calc(100%-60px)] rounded-t-3xl bg-white md:w-[500px] md:rounded-2xl md:shadow-lg md:h-max md:mx-auto md:mt-20 md:mb-[50vh] md:relative md:bottom-auto md:left-auto md:right-auto md:top-auto md:-translate-x-0">
            <div className="w-full h-[calc(100vh-188px)] md:h-auto">
              <div className="md:hidden flex items-end justify-center pt-4 pb-2 absolute top-0 left-0 right-0 bg-white">
                <div className="relative flex justify-center items-center w-full h-7">
                  <h2 className="font-semibold text-lg">Edit page hero</h2>
                  <button
                    onClick={onHideOverlay}
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center absolute right-4 transition duration-300 ease-in-out bg-lightgray active:bg-lightgray-dimmed"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:justify-between py-2 pr-4 pl-2">
                <button
                  onClick={onHideOverlay}
                  type="button"
                  className="h-9 px-3 rounded-full flex items-center gap-1 transition duration-300 ease-in-out active:bg-lightgray"
                >
                  <ArrowLeftIcon
                    className="fill-custom-blue -ml-[2px]"
                    size={20}
                  />
                  <span className="font-semibold text-sm text-custom-blue">
                    Edit page hero
                  </span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={clsx(
                    "relative h-9 w-max px-4 rounded-full overflow-hidden transition duration-300 ease-in-out text-white bg-custom-blue",
                    {
                      "bg-opacity-50": loading,
                      "active:bg-custom-blue-dimmed": !loading,
                    }
                  )}
                >
                  {loading ? (
                    <div className="flex gap-1 items-center justify-center w-full h-full">
                      <Spinner />
                      <span className="text-white">Saving</span>
                    </div>
                  ) : (
                    <span className="text-white">Save</span>
                  )}
                </button>
              </div>
              <div className="w-full h-full mt-[52px] md:mt-0 px-5 pt-5 pb-28 md:pb-10 flex flex-col gap-5 overflow-x-hidden overflow-y-visible invisible-scrollbar md:overflow-hidden">
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-sm">Visibility</h2>
                  <div className="w-max rounded-md h-9 flex gap-4 items-center justify-between px-3 bg-lightgray">
                    <div className="text-sm">
                      Display page hero on storefront
                    </div>
                    <div
                      onClick={() =>
                        setVisibility((prevVisibility) =>
                          prevVisibility === VISIBLE ? HIDDEN : VISIBLE
                        )
                      }
                      className={clsx(
                        "w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200",
                        {
                          "bg-white border": visibility === HIDDEN,
                          "bg-custom-blue border border-custom-blue":
                            visibility === VISIBLE,
                        }
                      )}
                    >
                      <div
                        className={clsx(
                          "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)]",
                          {
                            "left-[5px] bg-black": visibility === HIDDEN,
                            "left-[23px] bg-white": visibility === VISIBLE,
                          }
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="image" className="font-semibold text-sm">
                    Image
                  </label>
                  <div>
                    <div className="w-full border rounded-md overflow-hidden">
                      <div className="w-full min-h-[86px] flex items-center justify-center overflow-hidden">
                        {image && isValidRemoteImage(image) ? (
                          <Image
                            src={image}
                            alt={title}
                            width={766}
                            height={308}
                            priority={true}
                          />
                        ) : (
                          <CiImageOn className="fill-neutral-200" size={80} />
                        )}
                      </div>
                      <div className="w-full h-9 border-t overflow-hidden">
                        <input
                          type="text"
                          name="image"
                          placeholder="Paste image URL"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="h-full w-full px-3 text-gray"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-semibold text-sm">
                    Title
                  </label>
                  <div className="w-full h-9 relative">
                    <input
                      type="text"
                      name="title"
                      placeholder="Shop Denim Skirts"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-9 px-3 rounded-md border"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="destination_url"
                    className="font-semibold text-sm"
                  >
                    Destination URL
                  </label>
                  <div className="w-full h-9 relative">
                    <input
                      type="text"
                      name="destination_url"
                      placeholder="https://cherlygood.com/shop/denim-skirts"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-md border"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden w-full pb-5 pt-2 px-5 absolute bottom-0">
              <button
                onClick={handleSave}
                disabled={loading}
                className={clsx(
                  "relative h-12 w-full rounded-full overflow-hidden transition duration-300 ease-in-out text-white bg-custom-blue",
                  {
                    "bg-opacity-50": loading,
                    "active:bg-custom-blue-dimmed": !loading,
                  }
                )}
              >
                {loading ? (
                  <div className="flex gap-1 items-center justify-center w-full h-full">
                    <Spinner />
                    <span className="text-white">Saving</span>
                  </div>
                ) : (
                  <span className="text-white">Save</span>
                )}
              </button>
            </div>
          </div>
        </Overlay>
      )}
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}