"use client";

import AlertMessage from "@/components/shared/AlertMessage";
import { isValidRemoteImage } from "@/libraries/utils";
import { FormEvent, useState, useEffect } from "react";
import Spinner from "@/ui/Spinners/White";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { ArrowLeftIcon, CloseIcon, EditIcon } from "@/icons";
import clsx from "clsx";
import Image from "next/image";
import Overlay from "@/ui/Overlay";
import { UpdateProductAction } from "@/actions/products";

type DataType = {
  id: string;
  poster: string;
};

export function PosterButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.poster.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      type="button"
      className="w-9 h-9 rounded-full flex items-center justify-center transition duration-300 ease-in-out active:bg-lightgray lg:hover:bg-lightgray"
    >
      <EditIcon size={20} />
    </button>
  );
}

export function PosterOverlay({ data }: { data: DataType }) {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [poster, setPoster] = useState(data.poster);
  
  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.poster.name,
      isOverlayVisible: state.pages.editProduct.overlays.poster.isVisible,
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

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const message = await UpdateProductAction({ id: data.id, poster });
      setAlertMessage(message);
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update product");
      setShowAlert(true);
    } finally {
      setLoading(false);
      onHideOverlay();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoster(event.target.value);
  };

  return (
    <>
      {isOverlayVisible && (
        <Overlay>
          <div className="absolute bottom-0 left-0 right-0 w-full h-[calc(100%-60px)] rounded-t-3xl overflow-hidden bg-white md:w-[424px] md:rounded-2xl md:shadow md:h-max md:mx-auto md:mt-20 md:mb-[50vh] md:relative md:bottom-auto md:left-auto md:right-auto md:top-auto md:-translate-x-0">
            <form onSubmit={handleSave}>
              <div className="w-full h-[calc(100vh-188px)] md:h-auto">
                <div className="md:hidden flex items-end justify-center pt-4 pb-2 absolute top-0 left-0 right-0 bg-white">
                  <div className="relative flex justify-center items-center w-full h-7">
                    <h2 className="font-semibold text-lg">Poster</h2>
                    <button
                      onClick={() => {
                        hideOverlay({ pageName, overlayName });
                        setPoster(data.poster);
                      }}
                      type="button"
                      className="w-7 h-7 rounded-full flex items-center justify-center absolute right-4 transition duration-300 ease-in-out bg-lightgray active:bg-lightgray-dimmed"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex md:items-center md:justify-between py-2 pr-4 pl-2">
                  <button
                    onClick={() => {
                      hideOverlay({ pageName, overlayName });
                      setPoster(data.poster);
                    }}
                    type="button"
                    className="h-9 px-3 rounded-full flex items-center gap-1 transition duration-300 ease-in-out active:bg-lightgray"
                  >
                    <ArrowLeftIcon className="fill-custom-blue -ml-[2px]" size={20} />
                    <span className="font-semibold text-sm text-custom-blue">
                      Poster
                    </span>
                  </button>
                  <button
                    type="submit"
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
                <div className="w-full h-full mt-[52px] md:mt-0 p-5 pb-28 md:pb-10 flex flex-col gap-5 overflow-x-hidden overflow-y-visible invisible-scrollbar md:overflow-hidden">
                  <div>
                    <div className="w-full max-w-[383px] mx-auto border rounded-md overflow-hidden">
                      <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                        {poster && isValidRemoteImage(poster) && (
                          <Image
                            src={poster}
                            alt="Poster"
                            width={383}
                            height={383}
                            priority
                          />
                        )}
                      </div>
                      <div className="w-full h-9 border-t overflow-hidden">
                        <input
                          type="text"
                          name="poster"
                          placeholder="Paste image URL"
                          value={poster}
                          onChange={handleInputChange}
                          className="h-full w-full px-3 text-gray"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:hidden w-full pb-5 pt-2 px-5 absolute bottom-0">
                <button
                  type="submit"
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
            </form>
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
