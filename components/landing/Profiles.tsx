import { classNames } from "../../utils/classnames";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { ProfileItem } from "../../types/Profile";
import { BadgeCheckIcon } from "@heroicons/react/outline";
import ProfileAvatar from "../profile/display/avatar";

interface Props {
  profiles: ProfileItem[];
}

const Profiles: React.FC<Props> = (props) => {
  const { profiles } = props;

  const badge = (profile: ProfileItem) => {
    let comp;
    if (!profile.nft_display) {
      comp = <ProfileAvatar name={profile.name} />;
    } else {
      comp = (
        <div
          className={classNames(
            profile.nft_display
              ? "ring-2 ring-secondary-500 bg-primary-500 shadow-lg shadow-primary-500/50"
              : "",
            "relative flex-shrink-0 inline-block rounded-full  m-2"
          )}
          aria-hidden="true"
        >
          <img
            className="rounded-full h-24 w-24"
            alt=""
            src={profile.picture}
          />
          {profile.nft_meta_data && profile.nft_display && (
            <span className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 block rounded-full ">
              <BadgeCheckIcon className="block h-6 w-6 text-primary-500 rounded-lg" />
            </span>
          )}
        </div>
      );
    }

    return (
      <a
        className="flex flex-col justify-center items-center"
        href={`/${profile.handle}`}
        key={profile.id}
      >
        {comp}
        {profile.handle && (
          <p className="text-2xl font-bold mt-2 mb-1 text-center dark:">
            {profile.handle}
          </p>
        )}
        {profile.bio && <p className="text-md text-center">{profile.bio}</p>}
      </a>
    );
  };

  return (
    <div>
      <p className="text-4xl font-extrabold mb-8 text-center ">
        Our featured creators
      </p>
      <div
        className={`grid container grid-cols-1 md:grid-cols-${Math.min(
          profiles.length,
          4
        )} gap-4 items-center`}
      >
        {profiles.map((profile, id) => badge(profile))}
      </div>
    </div>
  );
};

export default Profiles;
