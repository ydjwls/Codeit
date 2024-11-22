import reviewRepository from '../repositories/reviewRepository.js';

async function create(review) {
  return reviewRepository.save(review);
}

async function getById(id) {
  return reviewRepository.getById(id);
}

async function getAll() {
  return reviewRepository.getAll();
}

async function update(id, review) {
  return reviewRepository.update(id, review);
}

async function deleteById(id) {
  return reviewRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
