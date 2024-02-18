export const success = (params?: {
  code?: number;
  msg: string;
  data?: any;
}) => {
  const msg = params?.msg || '操作成功';
  const data = params?.data || null;
  return {
    code: 0,
    msg,
    data,
  };
};

export const fail = (params?: { code?: number; msg: string; data?: any }) => {
  const code = params?.code || 1;
  const msg = params?.msg || '操作失败';
  const data = params?.data || null;
  return {
    code,
    msg,
    data,
  };
};
