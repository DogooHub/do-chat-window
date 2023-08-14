import React, {useMemo} from 'react';
import {Avatar} from "antd";
import {BASE_URL_IMAGE} from "../../services/axios";


const IMAvatarGroup = ({users}) => {

    const [p1, p2] = useMemo(() => users.slice(-2), [users]);

    return (
        <div className={"relative flex justify-center items-center w-1/5 aspect-square flex-shrink-0 flex-grow-0"}>
            <Avatar
                src={`${BASE_URL_IMAGE}${p1.portraitPreview}`}
                className={"w-2/3 h-2/3 absolute top-0 right-0 z-0"}
            />
            <Avatar
                src={`${BASE_URL_IMAGE}${p2.portraitPreview}`}
                className={"w-2/3 h-2/3 absolute left-0 bottom-0 z-[1] border-2 border-solid border-white"}
            />
        </div>
    );
};

IMAvatarGroup.propTypes = {};

export default IMAvatarGroup;
