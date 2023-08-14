import React, {useEffect, useMemo, useState} from 'react';
import {Loading3QuartersOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

const InfiniteScrollContainer = ({
                                     id,
                                     className = "",
                                     fetchData,
                                     hasMore,
                                     loader,
                                     children,
                                     revert = false,
                                     elemRef,
                                     loadFirst = true,
                                     endMessage
                                 }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loadFirst) {
            load();
        }
    }, [loadFirst]);

    const load = () => {
        setLoading(true);
        Promise.all([fetchData()]).finally(() => {
            setLoading(false);
        });
    }

    const onScroll = (e) => {
        if (loading || !hasMore) {
            return;
        }

        const {clientHeight, scrollTop, scrollHeight} = e.target;

        if (revert && scrollTop < scrollHeight * 0.1) {
            load();
            return;
        }

        if (!revert && clientHeight + scrollTop > scrollHeight * 0.8) {
            load();
        }
    }

    const renderLoader = useMemo(() => {
        if (!loader) {
            return <div className={"w-full text-center py-2"}>
                <Loading3QuartersOutlined style={{fontSize: 20}} spin={true}/>
            </div>
        }

        return loader;
    }, [loader]);

    return (
        <div
            id={id}
            ref={elemRef}
            className={`h-full overflow-auto ${className}`}
            onScroll={onScroll}>
            {revert && !hasMore && endMessage}
            {revert && hasMore && loading && renderLoader}
            {children}
            {!revert && hasMore && loading && renderLoader}
            {!revert && !hasMore && endMessage}
        </div>
    );
};

InfiniteScrollContainer.propTypes = {
    fetchData: PropTypes.func.isRequired,
};

export default InfiniteScrollContainer;
