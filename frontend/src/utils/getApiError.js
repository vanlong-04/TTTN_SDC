const getApiError = (error, fallback = "Đã xảy ra lỗi") => {
  const data = error.response?.data;
  const details = data?.details || data?.errors;

  if (Array.isArray(details) && details.length) {
    return details.map((item) => item?.message || String(item)).join(" · ");
  }

  return data?.message || error.message || fallback;
};

export default getApiError;
