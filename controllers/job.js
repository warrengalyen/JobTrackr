const Job = require('../models/Job');
const Category = require('../models/Category');
const Note = require('../models/Note');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const psl = require('psl');
var { ObjectID } = require('mongodb');

exports.getJobs = async (req, res) => {
    try {
        var query = {
            user: req.params.userId,
        };

        for (var key in req.body) {
            req.body[key] ? (query[key] = req.body[key]) : null;
            key === 'title' ? (query[key] = new RegExp(req.body[key], 'i')) : null;
            key === 'createdAt' && delete query[key];
        }

        const jobs = await Job.find(query)
            .populate('category')
            .populate({ path: 'notes', options: { sort: { createdAt: -1 } } })
            .sort({
                createdAt: req.body.createdAt,
            });

        if (jobs) {
            res.json(jobs);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('Error loading jobs');
    }
};

exports.fetchJob = async (req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    try {
        const { link } = req.body;

        if (!link) return res.status(400).send('Please enter url');

        // fetch job info
        const response = await fetch(link, { signal: controller.signal });
        const body = await response.text();

        // parse the html text and extract titles
        const $ = cheerio.load(body);
        let company = '';
        let title = $('title').text();
        const desc = $('meta[name=description]').attr('content');
        let image = $("link[rel='icon']").attr('href');

        const domain = new URL(link).hostname;
        const protocol = new URL(link).protocol;
        const parsed = psl.parse(domain);

        let newImage = protocol + '//www.' + parsed.domain + image;

        if (image === undefined && parsed.domain !== 'indeed.com' && parsed.domain !== 'linkedin.com') {
            image = $('meta[property=og:image]').attr('content');
            const domain = new URL(image).hostname;
            const pathname = new URL(image).pathname;
            const protocol = new URL(image).protocol;
            const parsed = psl.parse(domain);

            newImage = protocol + '//www.' + parsed.domain + pathname;
        }

        if (parsed.domain === 'linkedin.com') {
            //company = $('a.app-aware-link').text();
            //title =  $('.job-details-jobs-unified-top-card__job-title').text();
        }

        // if (title || desc === undefined) {
        //   return res.status(400).send("Couldn't fetch job please enter manually");
        // }

        return res.json({
            company,
            title,
            desc,
            image: newImage,
        });
    } catch (err) {
        console.log(err);
        if (err.type === 'aborted') {
            clearTimeout(timeout);
            return res.status(400).send("Couldn't fetch job, please enter manually");
        }
        console.log(err);
        return res.status(400).send('Error. Please enter job manually');
    }
};

exports.addJob = async (req, res) => {
    try {
        let { link, company, title, description, category, image, endDate } =
            req.body.jobDetails;

        // validate fields
        if (!company) return res.status(400).send('Please enter company name');
        if (!link) return res.status(400).send('Please enter url');
        if (!category) return res.status(400).send('Please select category');

        // check if job with same link exists
        let jobExist = await Job.findOne({
            link: link,
            user: req.params.userId,
        }).exec();
        if (jobExist) return res.status(400).send('You already added this job');

        const domain = new URL(link).hostname;
        const parsed = psl.parse(domain);

        if (parsed.domain === 'linkedin.com')
            image = 'https://static.licdn.com/aero-v1/sc/h/5bukxbhy9xsil5mb7c2wulfbx';

        if (parsed.domain === 'indeed.com')
            image = 'https://indeed.com/images/favicon.ico';

        const job = new Job({
            link,
            company,
            title,
            description,
            category,
            image: image,
            user: req.params.userId,
            status: 'applied',
            sld: parsed.sld,
            domain: parsed.domain,
            endDate,
        });

        await job.save();

        const catToUpdate = await Category.findOne({ _id: category });
        if (catToUpdate) {
            catToUpdate.jobCount = catToUpdate.jobCount + 1;
            await catToUpdate.save();
        }

        const jobs = await Job.find({ user: req.params.userId })
            .populate('category')
            .populate({ path: 'notes', options: { sort: { createdAt: -1 } } })
            .sort({
                createdAt: 'descending',
            });
        if (jobs) {
            return res.json(jobs);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};

exports.editJob = async (req, res) => {
    try {
        let { jobId, link, title, description, category, endDate } =
            req.body.jobDetails;

        // validate fields
        if (!link) return res.status(400).send('Please enter url');
        if (!category) return res.status(400).send('Please select category');

        const domain = new URL(link).hostname;
        const parsed = psl.parse(domain);

        const editJob = {
            link,
            title,
            description,
            category,
            user: req.params.userId,
            status: 'applied',
            sld: parsed.sld,
            domain: parsed.domain,
            endDate,
        };

        await Job.findOneAndUpdate(
            { _user: req.params.userId, _id: jobId },
            { $set: editJob },
            { new: true, useFindAndModify: false }
        );

        const jobs = await Job.find({ user: req.params.userId })
            .populate('category')
            .populate({ path: 'notes', options: { sort: { createdAt: -1 } } })
            .sort({
                createdAt: 'descending',
            });
        if (jobs) {
            return res.json(jobs);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};

exports.deleteJob = async (req, res) => {
    try {
        let { jobId, category } = req.body;

        await Note.deleteMany({ _user: req.params.userId, job: jobId });

        await Job.findOneAndDelete({ _user: req.params.userId, _id: jobId });

        const catToUpdate = await Category.findOne({ _id: category });
        if (catToUpdate) {
            catToUpdate.jobCount = catToUpdate.jobCount - 1;
            await catToUpdate.save();
        }

        const jobs = await Job.find({ user: req.params.userId })
            .populate('category')
            .populate({ path: 'notes', options: { sort: { createdAt: -1 } } })
            .sort({
                createdAt: 'descending',
            });
        if (jobs) {
            return res.json(jobs);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};

exports.changeJobStatus = async (req, res) => {
    const { status, userId } = req.body;
    try {
        await Job.updateOne(
            { _id: req.params.jobId, user: userId },
            { status: status },
            { upsert: true }
        );

        const jobs = await Job.find({ user: userId })
            .populate('category')
            .populate({ path: 'notes', options: { sort: { createdAt: -1 } } })
            .sort({
                createdAt: 'descending',
            });
        if (jobs) {
            return res.json(jobs);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};

exports.getJobSites = async (req, res) => {
    try {
        const sites = await Job.aggregate([
            { $match: { user: new ObjectID(req.params.userId) } },
            {
                $group: {
                    _id: '$sld',
                    count: { $sum: 1 },
                },
            },
        ]);

        return res.json(sites);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};

exports.getJobStats = async (req, res) => {
    try {
        const stats = await Job.aggregate([
            { $match: { user: new ObjectID(req.params.userId) } },
            {
                $group: {
                    _id: { $month: '$createdAt' }, // group by the month *number*, mongodb doesn't have a way to format date as month names
                    number: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: false, // remove _id
                    month: {
                        // set the field month as the month name representing the month number
                        $arrayElemAt: [
                            [
                                '', // month number starts at 1, so the 0th element can be anything
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December',
                            ],
                            '$_id',
                        ],
                    },
                    number: true, // keep the count
                },
            },
        ]);

        return res.json(stats);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error. Try again');
    }
};
