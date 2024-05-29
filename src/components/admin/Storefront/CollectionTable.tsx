"use client";

import { ChangeIndexIcon, ChevronRightIcon, EditIcon } from "@/icons";
import { capitalizeFirstLetter } from "@/libraries/utils";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineBan, HiOutlineClock } from "react-icons/hi";
import { IoHourglassOutline } from "react-icons/io5";

export default function CollectionTable({
  collections,
}: {
  collections: CollectionType[];
}) {
  const CAMPAIGN_STATUS_ENDED = "Ended";
  const CAMPAIGN_STATUS_UPCOMING = "Upcoming";
  const CAMPAIGN_STATUS_ACTIVE = "Active";
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";
  const PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageJumpValue, setPageJumpValue] = useState("1");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const pagination = (
    data: CollectionType[],
    currentPage: number,
    rowsPerPage: number
  ) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArray = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return {
      paginatedArray,
      totalPages,
    };
  };

  const rowsPerPage = 2;
  const { paginatedArray: tableData, totalPages } = pagination(
    collections,
    currentPage,
    rowsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const value = Math.max(prevPage - 1, 1);
      setPageJumpValue(String(value));

      return value;
    });
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const value = Math.min(prevPage + 1, totalPages);
      setPageJumpValue(String(value));

      return value;
    });
  };

  const jumpToPage = () => {
    const page = parseInt(pageJumpValue, 10);

    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      jumpToPage();
    }
  };

  const jumpToLastPage = () => {
    setPageJumpValue(String(totalPages));
    setCurrentPage(totalPages);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getCampaignStatus = (startDate: string, endDate: string): string => {
    const currentDate = new Date();
    const campaignStartDate = new Date(startDate);
    const campaignEndDate = new Date(endDate);

    campaignStartDate.setUTCHours(0, 0, 0, 0);
    campaignEndDate.setUTCHours(0, 0, 0, 0);

    if (currentDate.getTime() > campaignEndDate.getTime()) {
      return CAMPAIGN_STATUS_ENDED;
    } else if (currentDate.getTime() < campaignStartDate.getTime()) {
      return CAMPAIGN_STATUS_UPCOMING;
    } else {
      return CAMPAIGN_STATUS_ACTIVE;
    }
  };

  return (
    <div className="w-full max-w-[1016px] mx-auto px-5 min-[1068px]:p-0">
      <div className="w-full h-full py-3 shadow rounded-xl bg-white">
        <div className="h-full">
          <div className="h-full overflow-auto custom-x-scrollbar">
            <table className="w-full text-sm">
              <thead className="border-y bg-neutral-100">
                <tr className="h-10 *:font-semibold *:text-gray">
                  <td className="text-center border-r">#</td>
                  <td className="pl-3 border-r">Campaign duration</td>
                  <td className="pl-3 border-r">Title</td>
                  <td className="pl-3 border-r">Products</td>
                  <td className="pl-3 border-r">Type</td>
                  <td className="pl-3 border-r">Visibility</td>
                  <td className="pl-3"></td>
                </tr>
              </thead>
              <tbody className="*:h-[98px] *:border-b">
                {tableData.map(
                  ({
                    id,
                    index,
                    title,
                    slug,
                    campaign_duration,
                    collection_type,
                    products,
                    visibility,
                  }) => (
                    <tr key={index} className="h-[98px]">
                      <td className="w-14 min-w-14 text-center font-medium border-r">
                        {index}
                      </td>
                      <td className="relative px-3 w-max min-w-max border-r">
                        <div className="flex items-center gap-1 absolute left-3 top-2">
                          {getCampaignStatus(
                            campaign_duration.start_date,
                            campaign_duration.end_date
                          ) === CAMPAIGN_STATUS_UPCOMING && (
                            <IoHourglassOutline
                              className="stroke-custom-gold fill-custom-gold"
                              size={18}
                            />
                          )}
                          {getCampaignStatus(
                            campaign_duration.start_date,
                            campaign_duration.end_date
                          ) === CAMPAIGN_STATUS_ACTIVE && (
                            <HiOutlineClock
                              className="stroke-custom-green"
                              size={18}
                            />
                          )}
                          {getCampaignStatus(
                            campaign_duration.start_date,
                            campaign_duration.end_date
                          ) === CAMPAIGN_STATUS_ENDED && (
                            <HiOutlineBan
                              className="stroke-custom-red"
                              size={18}
                            />
                          )}
                          <span
                            className={clsx("italic", {
                              "text-custom-gold":
                                getCampaignStatus(
                                  campaign_duration.start_date,
                                  campaign_duration.end_date
                                ) === CAMPAIGN_STATUS_UPCOMING,
                              "text-custom-green":
                                getCampaignStatus(
                                  campaign_duration.start_date,
                                  campaign_duration.end_date
                                ) === CAMPAIGN_STATUS_ACTIVE,
                              "text-custom-red":
                                getCampaignStatus(
                                  campaign_duration.start_date,
                                  campaign_duration.end_date
                                ) === CAMPAIGN_STATUS_ENDED,
                            })}
                          >
                            {getCampaignStatus(
                              campaign_duration.start_date,
                              campaign_duration.end_date
                            )}
                          </span>
                        </div>
                        <div className="w-full h-[95px] flex items-end pb-2">
                          <div className="flex flex-col gap-1 h-max">
                            <div className="flex gap-2 items-center">
                              <div
                                className={clsx(
                                  "px-3 rounded-full h-6 w-max flex gap-1 items-center",
                                  {
                                    "bg-custom-green/10 border border-custom-green/15":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ACTIVE,
                                    "bg-lightgray border border-[#6c6c6c]/15":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ENDED ||
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_UPCOMING,
                                  }
                                )}
                              >
                                <span className="text-gray">Launch date</span>
                                <ChevronRightIcon
                                  className="stroke-gray"
                                  size={16}
                                />
                                <span
                                  className={clsx({
                                    "text-custom-green":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ACTIVE,
                                  })}
                                >
                                  {formatDate(campaign_duration.start_date)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <div
                                className={clsx(
                                  "px-3 rounded-full h-6 w-max flex gap-1 items-center",
                                  {
                                    "bg-custom-red/10 border border-custom-red/15":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ENDED,
                                    "bg-lightgray border border-[#6c6c6c]/15":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ACTIVE ||
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_UPCOMING,
                                  }
                                )}
                              >
                                <span className="text-gray">End date</span>
                                <ChevronRightIcon
                                  className="stroke-gray"
                                  size={16}
                                />
                                <span
                                  className={clsx({
                                    "text-custom-red":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ENDED,
                                  })}
                                >
                                  {formatDate(campaign_duration.end_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 w-[250px] min-w-[250px] border-r">
                        <p className="line-clamp-2">{title}</p>
                      </td>
                      <td className="px-3 w-[100px] min-w-[100px] border-r">
                        <p>{products ? products.length : 0}</p>
                      </td>
                      <td className="px-3 w-[100px] min-w-[100px] border-r">
                        <p className="font-medium w-max">
                          {capitalizeFirstLetter(collection_type.toLowerCase())}
                        </p>
                      </td>
                      <td className="px-3 w-[100px] min-w-[100px] border-r">
                        {visibility === "PUBLISHED" ? (
                          <p className="px-3 rounded-full h-6 w-max flex gap-1 items-center bg-custom-green/10 border border-custom-green/15 text-custom-green">
                            {capitalizeFirstLetter(visibility.toLowerCase())}
                          </p>
                        ) : (
                          <p className="px-3 rounded-full h-6 w-max flex gap-1 items-center bg-lightgray border border-[#6c6c6c]/15 text-gray">
                            {capitalizeFirstLetter(visibility.toLowerCase())}
                          </p>
                        )}
                      </td>
                      <td className="px-3 w-full min-w-full">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/admin/shop/collections/${slug}-${id}`}
                            className="h-9 w-9 rounded-full flex items-center justify-center ease-in-out duration-300 transition active:bg-lightgray"
                          >
                            <EditIcon size={18} />
                          </Link>
                          <button className="h-9 w-9 rounded-full flex items-center justify-center ease-in-out duration-300 transition active:bg-lightgray">
                            <ChangeIndexIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
