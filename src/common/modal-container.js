import React, {useCallback, useMemo, useState} from 'react';
import {Modal} from 'antd';
import PropTypes from 'prop-types';
import {IoClose} from 'react-icons/io5';
import ButtonToolbar from "./button-toolbar";
import "./modal-container.scss"

const ModalContainer = ({
                            children,
                            container,
                            rootClassName,
                            modalProps = {
                                onOk: new Promise((resolve, reject) => {
                                }),
                            },
                            formId = '',
                            title = '',
                        }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const header = useMemo(() => {
        return (
            <div className={'flex items-center'}>
                <div className={'font-bold w-full flex justify-center'}>{title || ''}</div>
                <ButtonToolbar onClick={onClose} size={'default'} icon={<IoClose size={20}/>}/>
            </div>
        );
    }, [title]);

    const onOk = useCallback(async () => {
        if (modalProps.onOk) {
            setLoading(true);
            (await modalProps.onOk)()
                .then((value) => {
                    if (value) {
                        onClose();
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [modalProps]);

    return (
        <div className={rootClassName}>
            <div onClick={onOpen}>{container}</div>
            <Modal
                className={'modal-container'}
                open={open}
                centered={true}
                keyboard={true}
                closable={false}
                onCancel={onClose}
                destroyOnClose={true}
                forceRender={false}
                title={header}
                okButtonProps={{htmlType: 'submit', form: formId, loading}}
                style={{
                    maxHeight: '70%',
                    overflow: 'hidden',
                }}
                {...modalProps}
                onOk={onOk}
            >
                {React.cloneElement(children, {onCloseModal: onClose})}
            </Modal>
        </div>
    );
};

ModalContainer.propTypes = {
    container: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
};

export default ModalContainer;
