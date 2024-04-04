import {notification } from 'antd';






export function useErrorToast() {





  const [api, contextHolder] = notification.useNotification();

  const openToast = (description: string) => {
    api.open({
      message: 'An error occurred',
      description: description,
      duration: 0,
    });
  };
  return { openToast, contextHolder };




}