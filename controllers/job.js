const Job = require('../models/Job');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const psl = require('psl');

exports.getJobs = async (req, res) => {
    try {
        var query = {
            user: req.params.userId,
        };

        for (var key in req.body) {
            req.body[key] ? (query[key] = req.body[key]) : null;
        }

        const jobs = await Job.find(query)
            .populate('category')
            .populate('notes')
            .sort({
                createdAt: 'ascending',
            });

        if (jobs) {
            res.json(jobs);
        }
    } catch (error) {
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
        return res.status(400).send('Error. Try again');
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

        const jobs = await Job.find({ user: req.params.userId });
        if (jobs) {
            return res.json(jobs);
        }
    } catch (err) {
        return res.status(400).send('Error. Try again');
    }
};
