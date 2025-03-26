import apiClient from "./apiClient";

const tourService = {
  getAllTours: () => apiClient.get("/tours"),
  getTourById: (id) => apiClient.get(`/tours/${id}`),
  createTour: (data) => apiClient.post("/tours", data),
  updateTour: (id, data) => apiClient.put(`/tours/${id}`, data),
  deleteTour: (id) => apiClient.delete(`/tours/${id}`),
};

export default tourService;
