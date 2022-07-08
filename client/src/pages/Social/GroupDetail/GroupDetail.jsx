import { Image, message } from "antd";
import groupAPI from "@/apis/groupAPI";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import GroupSliderContents from "./SliderContents/GroupSliderContents";
import { getUrlImage } from "@/util/index";
import SNAvatar from "@/components/SNAvatar";

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState();

  const fetchGroupDetail = async () => {
    try {
      const res = await groupAPI.getGroupDetail(groupId);
      setGroup(res.data.data);
    } catch (error) {
      message.error("Get detail group fail!");
    }
  };
  useEffect(() => {
    fetchGroupDetail();
  }, []);
  return (
    <div className="flex flex-col p-0 lg:px-[4rem] ">
      {group && (
        <>
          <div className="shadow-2 pb-[1rem] rounded-xl bg-white">
            <div className="relative">
              <Image
                className="w-[100%] h-[300px] rounded-t-xl object-cover object-center"
                src={getUrlImage(group.cover)}
                fallback="data:image/png;base64,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"
              />
              <div className="absolute bottom-[-10px]  w-full flex justify-center rounded-full">
                <SNAvatar
                  className="border-2 border-gray-300"
                  size={120}
                  src={group.avatar}
                  fullName={group.groupName}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-[52px] px-[32px] relative">
              <div className="flex items-center gap-[60px] ">
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    0
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    post
                  </p>
                </div>
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    0
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    friends
                  </p>
                </div>
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    0
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    groups
                  </p>
                </div>
              </div>
              <div className=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <p className="text-[1.5rem] font-bold text-color-text leading-[1em]">
                  {group.groupName}
                </p>
                <p className="text-[0.875] font-medium text-color-text leading-[1em] mt-[6px] text-center">
                  {/* @{group.username} */}
                </p>
              </div>

              <div className=" flex gap-[12px]">
                {/* <div className="w-[40px] h-[40px] bg-[#3763d2] rounded-xl flex items-center justify-center">
                <FacebookOutlined style={{ color: "white" }} />
              </div>
              <div className="w-[40px] h-[40px] bg-[#1abcff] rounded-xl flex items-center justify-center">
                <TwitterOutlined style={{ color: "white" }} />
              </div>
              <div className="w-[40px] h-[40px] bg-[#f8468d] rounded-xl flex items-center justify-center">
                <InstagramOutlined style={{ color: "white" }} />
              </div> */}
                {/* <div className="">
                {!isMyProfile && (
                  <>
                    {isFriend ? (
                      <SNButton
                        text={"Unfriend"}
                        onClick={() => Unfriend()}
                      />
                    ) : (
                      <>
                        {!isFriendRequest && (
                          <SNButton
                            text={"Add friend"}
                            onClick={() => handleFriendRequest(1)}
                          />
                        )}
                        {!!isFriendRequest && (
                          <SNButton
                            text={"Cancel friend request"}
                            onClick={() => handleFriendRequest(0)}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div> */}
              </div>
            </div>
          </div>

          {/* <GroupSliderContents group={group} /> */}
        </>
      )}
    </div>
  );
};

export default GroupDetail;