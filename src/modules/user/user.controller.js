import { User } from "#src/models/index.js";

export const getAll = async (req, res) => {
	const data = await User.findAndCountAll();
	return res.sendSuccess(200, data);
};

export const getOne = async (req, res) => {
	const data = await User.findByPk(req.params.id);
	if (!data) {
		res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	await User.create(req.body);
	return res.sendSuccess(200, "User created successfully");
};

export const update = async (req, res) => {
	const data = await User.update(req.body, { where: { id: req.params.id } });
	if (data[0] === 0) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User updated successfully");
};

export const destroy = async (req, res) => {
	const data = await User.destroy({
		where: { id: req.params.id },
		// force: true, // for hard delete
	});
	if (!data) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User deleted successfully");
};

export const restore = async (req, res) => {
	const data = await User.restore({ where: { id: req.params.id } });
	if (!data) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User restored successfully");
};
