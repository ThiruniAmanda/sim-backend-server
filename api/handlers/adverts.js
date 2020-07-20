const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

const AdvertSchema = require("../schemas/advertSchema");

// create an advert by company
exports.CreateAdvert = (req, res) => {
    const result = joi.validate(req.body, AdvertSchema);
    const token = req.body.token;
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        console.log(verified);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
                client.query(
                    `INSERT INTO adverts
                    (   comp_id,
                        date_created ,
                        internship_position ,
                        position_desc ,
                        job_desc ,
                        knowledge_skills ,
                        benefits ,
                        no_of_positions ,
                        no_of_applicants ,
                        attachment_url ,
                        status   ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`, 
                        [   
                            verified.id,
                            new Date() ,
                            result.value.internship_position ,
                            result.value.position_desc ,
                            result.value.job_desc ,
                            'none' ,
                            'none' ,
                            result.value.no_of_positions ,
                            0,
                            result.value.attachment_url ,
                            'pending'
                        ],
                (err, resp) => {
                    client.release();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        return res.send(resp.rows[0]);
                    }
                });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get advert by id
exports.GetAdvert = ( req , res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`SELECT * FROM adverts WHERE id = '${res.params.id}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows[0]);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts
exports.GetAllAdverts = ( req , res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`SELECT * FROM adverts`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts by a given company
exports.GetAllAdvertsByCompany = ( req , res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`SELECT * FROM adverts WHERE comp_id = '${verified.id}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts by a given category
exports.GetAllAdvertsByCategory = ( req , res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`SELECT * FROM adverts WHERE internship_position = '${req.params.category}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//approve an advert by PDC
exports.ApproveAdvert = ( req , res) => {
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`UPDATE advert SET status = approved WHERE id= '${req.body.id}' RETURNING *`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//decline an advert by PDC
exports.DeclineAdvert = ( req , res ) => {
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`UPDATE advert SET status = declined WHERE id= '${req.body.id}' RETURNING *`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//apply for a advert by a student
exports.ApplyForAdvert = ( req , res ) => {
    console.log('apply for advert works');
}

//publish adverts for students by PDC
exports.PublishAdverts = (req , res) => {
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`UPDATE advert SET status = published' RETURNING *`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}