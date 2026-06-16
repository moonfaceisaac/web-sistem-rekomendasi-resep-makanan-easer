export function getFriendlyApiError(error, fallback = "Request failed") {
  if (!error.response) {
    return "Network error. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const serverMessage = error.response?.data?.message;

  if (status === 401) {
    return serverMessage || "You are not authorized. Please log in again.";
  }

  if (status === 403) {
    return serverMessage || "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return serverMessage || "The requested resource was not found.";
  }

  if (status >= 500) {
    return "Something went wrong on the server. Please try again later.";
  }

  return serverMessage || fallback;
}
