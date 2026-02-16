const dayjs = require('dayjs');
const { CONSTANTS } = require("../../Constant");
const { PlanDal, SysSettings, TCDal, HealthCheckupPlanDal, SpecializationDal, DoctorDal,
  ContactUsRetailDAL, ContactUsCorporateDAL, ContactUsEmailDAL, BlogsDal, GoogleReviewsDal, FaqDal, MediaDal,
  EventsDal, LinkedinDal, JobsDal, JobApplicationDal, MyTestDal
} = require("../../DAL")
const { Utils, ApiError } = require("../../Utils")
const { CONSTANTS_MESSAGES } = require("../../Helper");
const { StatusCodes } = require("http-status-codes");
const PublicService = {
  UploadFile: async (files) => {
    const uploadPromises = files.map(async (file) => {
      const token = await Utils.generateRandomToken();
      const fileName = `public/${token}/${new Date()}${file.originalname}`;
      return Utils.UploadFile(file.buffer, fileName, file.mimetype);
    });
    return await Promise.all(uploadPromises);
  },

  GetStates: async () => CONSTANTS.STATES,

  GetRelations: async () => CONSTANTS.FAMILY_RELATION,

  GetAllPlan: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = -1,
      subscriberTypeFilter = CONSTANTS.SUBSCRIBER_TYPE.INDIVIDUAL,
      corporateFilter = "ALL"
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        name: { $regex: search, $options: "i" },
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);

    if (subscriberTypeFilter !== "ALL") {
      searchQuery.subscriber_type = Number(subscriberTypeFilter);
    }
    if (Number(subscriberTypeFilter) === CONSTANTS.SUBSCRIBER_TYPE.CORPORATE && corporateFilter !== "ALL") {
      searchQuery.corporate = corporateFilter;
    }
   
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await PlanDal.GetAllPlan(searchQuery, "", pagination)

    await Promise.all(resp.map(async (data) => {
      data.files = await Promise.all(data.files.map(async (file) => {
        return await Utils.getFileURL(file);
      }));
      await Promise.all(data.membership_options.map(async (option) => {
        option.charges_incl_GST = option.charges + (option.charges * CONSTANTS.PAYMENT.GST / 100);
      }));

    }));

    const totalCount = await PlanDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetHealthTest: async () => {
    return await MyTestDal.GetHealthTests();
  },

  GetFileSize: async () => {
    return await SysSettings.GetSysSettings()
  },

  GetTC: async (key) => {
    return await TCDal.GetOneTC({ type: key })
  },

  GetAllHealthCheckupPlan: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "base_price",
      sortOrder = 1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { checkup_code: { $regex: search, $options: "i" } },
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await HealthCheckupPlanDal.GetAllHealthCheckupPlans(searchQuery, "", pagination);
    const totalCount = await HealthCheckupPlanDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },
  GetAllSpecialization: async (data) => {
    const {
      search = "",
      page = 1,
      pageSize = 1000,
      sortBy = "name",
      sortOrder = 1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery;
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
        ]
      };
    } else {
      searchQuery = {};
    }
    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await SpecializationDal.GetAllSpecialization(searchQuery, "", pagination);
    const totalCount = await SpecializationDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  AddDoctor: async (data) => {
    const checkPromises = [
      DoctorDal.CheckUniqueRegNo({ reg_no: data.reg_no }).then(res => res ? 'DOC_REGNO_EXISTS' : null),
      DoctorDal.CheckUniqueRegNo({ email: data.email }).then(res => res ? 'EMAIL_EXISTS' : null),
      DoctorDal.CheckUniqueRegNo({ mobile: data.mobile }).then(res => res ? 'MOBILE_EXISTS' : null)
    ];
    const results = await Promise.all(checkPromises);
    const error = results.find(result => result !== null);
    if (error) throw new ApiError(CONSTANTS_MESSAGES[error], StatusCodes.BAD_REQUEST);
    data.added_by = CONSTANTS.DOCTOR.ADDED_BY_DOCTOR;
    data.status = CONSTANTS.STATUS.ACTIVE;
    return await DoctorDal.CreateDoc(data);
    Utils.sendBrevoMail.DoctorFormSubmitUser({
      template: "",
      subject: "",
      user: {name:data?.name, email:data?.email},
      params:{name:data?.email}
    });
    Utils.sendBrevoMail.DoctorFormSubmitAdmin({
      template: "",
      subject: "",
      user: {name:"OPDSure", email:process.env.BREVO_EMAIL_FROM},
      params:{name:data?.name, email:data?.email}
    });
   
  },

  AddContactUsRetail: async (data) => {
    await ContactUsRetailDAL.AddReferUsers(data);
   
    Utils.sendBrevoMail.RetailFormSubmitUser({
      template: "<p>Dear {{params.name}}, </p><p>		We would like to extend our sincere gratitude for reaching out to OPDSure and submitting your query via our support form. We value your time and trust in our services and are here to assist you with utmost care and efficiency. </p><p>Your query has been received and is currently under review by our support team. We will respond at the earliest possible opportunity. Should you wish to provide any additional information or have further questions, please feel free to reply to this email. </p><p>At OPDSure, we remain dedicated to delivering top-tier support and ensuring a seamless experience for you. </p><p>Thank you once again for choosing OPDSure. </p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: "Acknowledgment of Your Query Submission to OPDSure!",
      user: {name:data?.name, email:data?.email},
      params:{name:data?.name}
    });
    Utils.sendBrevoMail.RetailFormSubmitAdmin({
      template: "<p>Dear Admin, </p><p>		Retail user {{params.name}}, (mobile- {{params.phone}}, email - {{params.email}} has shown interest in OPDSure.</p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: "Retail user has submitted interest in OPDSure.",
      user: {name:"OPDSure", email:process.env.BREVO_EMAIL_FROM},
      params:{name:data?.name,email:data?.email,phone:data?.phone}
    });
    return {};
  },

  AddContactUsCorporate: async (data) => {
    await ContactUsCorporateDAL.AddReferUsers(data);
    
    Utils.sendBrevoMail.CorpoFormSubmitUser({
      template: "<p>Dear {{params.name}},</p><p>		Thank you for reaching out to us regarding OPDSure's Employee Health and Wellness Program. We appreciate your interest in exploring our services aimed at enhancing the health, well-being, and productivity of employees through comprehensive and personalized solutions. 		   </p><p>Your inquiry has been received, and our team will be delighted to provide you with detailed information about our program’s features, benefits, and the value it can bring to your organization. We are committed to supporting workplace wellness and look forward to discussing how our program can be tailored to meet your specific needs. </p><p>Please feel free to reply with any additional questions or to schedule a convenient time for a discussion. </p><p>Thank you once again for considering OPDSure as a partner in promoting health and wellness within your organization. </p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: "Thank You for Your Interest in OPDSure's Employee Health and Wellness Program.",
      user: {name:data?.name, email:data?.email},
      params:{name:data?.name}
    });
    Utils.sendBrevoMail.CorpoFormSubmitAdmin({
      template: "<p>Dear Admin, </p><p>		Corporate user {{params.name}}, (mobile- {{params.phone}}, email - {{params.email}} has shown interest in OPDSure.</p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: "Corporate user has shown interest in Employee Health and Wellness Program",
      user: {name:"OPDSure", email:process.env.BREVO_EMAIL_FROM},
      params:{name:data?.name, email:data?.email,phone:data?.phone}
    });
    return {};
  },

  AddContactUsEmail: async (data) => {
    await ContactUsEmailDAL.AddReferUsers(data);
    return {};
    Utils.sendBrevoMail.EmailFormSubmitUser({
      template: "",
      subject: "",
      user: {name:data?.email, email:data?.email},
      params:{name:data?.email}
    });
    Utils.sendBrevoMail.EmailFormSubmitAdmin({
      template: "<p>Dear Admin, </p><p>		User email - {{params.email}} has shown interest in OPDSure.</p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: "",
      user: {name:"OPDSure", email:process.env.BREVO_EMAIL_FROM},
      params:{name:data?.email, email:data?.email}
    });
    return {};
  },

  GetAllBlogs: async (data) => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await BlogsDal.GetAllBlogs(searchQuery, "-__v ", pagination);
    const totalCount = await BlogsDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    const finalData = await Promise.all(resp.map(async (m) => {
      const fileUrls = await Promise.all(m.files.map(async (file) => Utils.getFileURL1(file)));
      return {
        ...m,
        fileUrls
      };
    }));
    return {
      records: finalData,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetBlog: async (_id) => {
    const resp = await BlogsDal.FindOneBlog({ _id }, "");
    if (!resp) throw new ApiError(CONSTANTS_MESSAGES.BLOG_NOT_FOUND, StatusCodes.BAD_REQUEST);
    resp.url = await Promise.all(resp.files.map(async (file) => Utils.getFileURL1(file)));
    return {
      records: resp,
    };
  },

  GetAllGoogleReviews: async (data) => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await GoogleReviewsDal.GetAllReviews(searchQuery, "-__v ", pagination);
    const totalCount = await GoogleReviewsDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    const finalData = await Promise.all(resp.map(async (m) => {
      let avatar_url;
      if (m.avatar) avatar_url = Utils.getFileURL1(m.avatar);
      const { avatar, ...restData } = m;
      return {
        ...restData,
        avatar_url
      };
    }));
    return {
      records: finalData,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetGoogleReview: async (_id) => {
    const resp = await GoogleReviewsDal.FindOneReview({ _id }, "-__v");
    if (!resp) throw new ApiError(CONSTANTS_MESSAGES.BLOG_NOT_FOUND, StatusCodes.BAD_REQUEST);
    if (resp.avatar)
      resp.url = Utils.getFileURL1(resp.avatar);
    const { avatar, ...restData } = resp;
    return {
      restData
    };
  },

  GetAllFaqs: async (data) => {
    const { search, page = 1, pageSize = 10, sortBy = "question", sortOrder = "-1" } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    if (search) {
      searchQuery = {
        question: { $regex: search, $options: "i" }
      };
    }

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery };
    const resp = await FaqDal.GetAllFaqs(searchQuery, "", pagination);
    const totalCount = await FaqDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetAllMedias: async (data) => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await MediaDal.GetAllMedias(searchQuery, "-__v ", pagination);
    const totalCount = await MediaDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    const finalData = await Promise.all(resp.map(async (m) => {
      const fileUrls = await Promise.all(m.files.map(async (file) => Utils.getFileURL1(file)));
      return {
        ...m,
        fileUrls
      };
    }));
    const newFinalData = await Promise.all(finalData.map(async (m) => {
      const mediaIconUrl = m.media_icon && m.media_icon.length > 0
        ? Utils.getFileURL1(m.media_icon)
        : null;

      return {
        ...m,
        mediaIconUrl
      };
    }));

    return {
      records: newFinalData,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetMedia: async (_id) => {
    const resp = await MediaDal.FindOneMedia({ _id }, "");
    if (!resp) throw new ApiError(CONSTANTS_MESSAGES.MEDIA_NOT_FOUND, StatusCodes.BAD_REQUEST);
    resp.url = await Promise.all(resp.files.map(async (file) => Utils.getFileURL1(file)));
    return {
      records: resp,
    };
  },

  GetAllEvents: async (data) => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await EventsDal.GetAllEvents(searchQuery, "-__v ", pagination);
    const totalCount = await EventsDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);
    const finalData = await Promise.all(resp.map(async (m) => {
      const fileUrls = await Promise.all(m.files.map(async (file) =>  Utils.getFileURL1(file)));
      return {
        ...m,
        fileUrls
      };
    }));
    return {
      records: finalData,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetEvent: async (_id) => {
    const resp = await EventsDal.FindOneEvent({ _id }, "");
    if (!resp) throw new ApiError(CONSTANTS_MESSAGES.EVENT_NOT_FOUND, StatusCodes.BAD_REQUEST);
    resp.url = await Promise.all(resp.files.map(async (file) =>  Utils.getFileURL1(file)));
    return {
      records: resp,
    };
  },

  GetAllLinkedinPosts: async (data) => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await LinkedinDal.GetAllPosts(searchQuery, "-__v ", pagination);
    const totalCount = await LinkedinDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      records: resp,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  GetLinkedinPost: async (_id) => {
    const resp = await LinkedinDal.FindOnePost({ _id }, "");
    if (!resp) throw new ApiError(CONSTANTS_MESSAGES.POST_NOT_FOUND, StatusCodes.BAD_REQUEST);
    return {
      records: resp,
    };
  },

  GetAllJobs: async (data) => {
    const {
      search,
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = -1,
    } = data;
    const offset = (page - 1) * pageSize;
    const sortObject = {};
    let searchQuery = {};
    if (search) {
      searchQuery = {
        title: { $regex: search, $options: "i" }
      };
    } else {
      searchQuery = {};
    }

    sortObject[sortBy] = parseInt(sortOrder);
    const pagination = { offset, sortObject, pageSize, searchQuery }
    const resp = await JobsDal.GetAllJobs(searchQuery, "-__v ", pagination);
    const totalCount = await JobsDal.GetRecordCount(searchQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    const newFinalData = await Promise.all(resp.map(async (m) => {
      const jdUrl = m.jd ?  Utils.getFileURL1(m.jd) : null;

      return {
        ...m,
        jdUrl
      };
    }));

    return {
      records: newFinalData,
      pagination: {
        totalRecords: totalCount,
        pageSize: Number(pageSize),
        totalPages,
        currentPage: Number(page),
        nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      },
    };
  },

  CreateJobApplication: async (data) => {
    const job = await JobsDal.FindOneJob({ _id: data.job });
    if (job == "null") throw new ApiError(CONSTANTS_MESSAGES.JOB_NOT_FOUND, StatusCodes.BAD_REQUEST);
    const unique = await JobApplicationDal.FindOneApplication({ job: data.job, email: data.email, mobile: data.mobile });
    if (unique) throw new ApiError(CONSTANTS_MESSAGES.ALREADY_APPLIED, StatusCodes.BAD_REQUEST);
    await JobApplicationDal.CreateApplication(data);
    Utils.sendBrevoMail.JobFormSubmitUser({
      template: "<p>Dear {{params.name}},</p><p>		 Thank you for applying for a position of {{params.title}} with OPDSure. We appreciate your interest in joining our team and are grateful for the time and effort you dedicated to submitting your application. </p><p>Our team is currently reviewing all applications, and we will reach out to you if your qualifications align with the requirements of the position. We are committed to finding individuals whose skills and passion reflect our mission to improve healthcare services, and we are thrilled to consider you for this opportunity. </p><p>Thank you once again for considering OPDSure as a potential step in your career. We will keep you informed on the status of your application as soon as possible. </p><p>Warm regards, </p><p>HR Team </p><p>www.OPDSure.com</p>",
      subject: `Thank You for apply for ${job.title} to OPDSure.`,
      user: {name:data?.name, email:data?.email},
      params:{name:data?.name, title: job?.title}
    });
    Utils.sendBrevoMail.JobFormSubmitAdmin({
      template: "<p>Dear Admin, </p><p>		User {{params.name}} with (mobile- {{params.phone}}, email - {{params.email}} ) has shown interest in the profile {{params.title}}.</p><p>Warm regards, </p><p>Support Team </p><p>www.OPDSure.com </p><p>+91-9810113654</p>",
      subject: `Job seeker has appied for ${job.title}.`,
      user: {name:"OPDSure", email:process.env.BREVO_EMAIL_FROM},
      params:{name:data?.name, email:data?.email,phone:data?.mobile,title: job?.title}
    });
    return {};
  },


  TestSMS: (params) => {
    return Utils.SendSMS(params);
  },
  TestSMSAwait: async (params) => {
    return await Utils.SendSMSAwait(params);
  },

  CurrentTime : async () => {
    const dateTime = await dayjs().toISOString();
    return dateTime;
  }

};

module.exports = PublicService;
