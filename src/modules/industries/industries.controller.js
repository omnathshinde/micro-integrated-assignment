import { Industry } from "#src/models/index.js";

export const getAll = async (req, res) => {
	const data = await Industry.findAndCountAll();
	return res.sendSuccess(200, data);
};

export const getOne = async (req, res) => {
	const data = await Industry.findByPk(req.params.id);
	if (!data) {
		res.sendError(404, "Industry not found");
	}
	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	await Industry.create(req.body);
	return res.sendSuccess(200, "Industry created successfully");
};

export const update = async (req, res) => {
	const data = await Industry.update(req.body, { where: { id: req.params.id } });
	if (data[0] === 0) {
		return res.sendError(404, "Industry not found");
	}
	return res.sendSuccess(200, "Industry updated successfully");
};

export const destroy = async (req, res) => {
	const data = await Industry.destroy({
		where: { id: req.params.id },
		// force: true, // for hard delete
	});
	if (!data) {
		return res.sendError(404, "Industry not found");
	}
	return res.sendSuccess(200, "Industry deleted successfully");
};

export const restore = async (req, res) => {
	const data = await Industry.restore({ where: { id: req.params.id } });
	if (!data) {
		return res.sendError(404, "Industry not found");
	}
	return res.sendSuccess(200, "Industry restored successfully");
};
