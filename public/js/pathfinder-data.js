(function (root) {
  'use strict';

  // Static, reviewed copy. Visitor answers stay in page memory.
  var data = {
  "questions": {
    "goal": {
      "id": "goal",
      "kind": "question",
      "title": "How would you like to take part in this work?",
      "description": "Choose the area that best reflects why you have come to i2.",
      "options": [
        {
          "value": "network",
          "label": "Mobilize my denomination or church network"
        },
        {
          "value": "donor",
          "label": "Give to advance the Gospel among Muslims"
        },
        {
          "value": "church",
          "label": "Equip my congregation for Muslim evangelism"
        },
        {
          "value": "learner",
          "label": "Study Islam, apologetics, and Christian missions"
        }
      ]
    },
    "network-role": {
      "id": "network-role",
      "kind": "question",
      "title": "How do you serve the Church?",
      "description": "",
      "options": [
        {
          "value": "decision",
          "label": "I oversee a denomination or church network"
        },
        {
          "value": "leadership",
          "label": "I serve on our denominational leadership team"
        },
        {
          "value": "introducer",
          "label": "I advise church leaders or teach theology"
        },
        {
          "value": "local",
          "label": "I pastor or serve a local congregation"
        }
      ]
    },
    "network-reach": {
      "id": "network-reach",
      "kind": "question",
      "title": "How many churches could you help mobilize?",
      "description": "An approximate number is enough.",
      "options": [
        {
          "value": "one",
          "label": "1 church"
        },
        {
          "value": "small",
          "label": "2–25 churches"
        },
        {
          "value": "medium",
          "label": "26–100 churches"
        },
        {
          "value": "large",
          "label": "101–1,000 churches"
        },
        {
          "value": "national",
          "label": "More than 1,000 churches"
        },
        {
          "value": "unsure",
          "label": "I would need to confirm"
        }
      ]
    },
    "network-support": {
      "id": "network-support",
      "kind": "question",
      "title": "What would most strengthen this work in your churches?",
      "description": "",
      "options": [
        {
          "value": "trainers",
          "label": "Train pastors who can equip others"
        },
        {
          "value": "initiative",
          "label": "Establish a plan to reach Muslims across our region"
        },
        {
          "value": "coordination",
          "label": "Coordinate prayer, evangelism, and discipleship"
        },
        {
          "value": "model",
          "label": "Understand how i2 serves denominations"
        }
      ]
    },
    "network-stage": {
      "id": "network-stage",
      "kind": "question",
      "title": "What is happening in your churches at present?",
      "description": "",
      "options": [
        {
          "value": "exploring",
          "label": "We are considering how to begin this work"
        },
        {
          "value": "discussing",
          "label": "Our leaders are prayerfully discussing it"
        },
        {
          "value": "planning",
          "label": "We are ready to plan training and outreach"
        },
        {
          "value": "implementing",
          "label": "Our churches are already reaching Muslims"
        }
      ]
    },
    "network-next": {
      "id": "network-next",
      "kind": "question",
      "title": "How can i2 serve you at this stage?",
      "description": "",
      "options": [
        {
          "value": "plan",
          "label": "Read the Every Muslim for Christ strategy"
        },
        {
          "value": "talk",
          "label": "Speak with i2 about our denomination"
        },
        {
          "value": "training",
          "label": "Review training for our pastors and leaders"
        },
        {
          "value": "requirements",
          "label": "Understand what launching the Initiative involves"
        },
        {
          "value": "recommend",
          "label": "Show me resources suited to our ministry"
        }
      ]
    },
    "network-region": {
      "id": "network-region",
      "kind": "text",
      "title": "In which country or region do you serve?",
      "description": "Optional. You can include this when you contact us about serving your churches.",
      "label": "Country or region",
      "placeholder": "Your country or region",
      "skipLabel": "Skip this detail"
    },
    "network-language": {
      "id": "network-language",
      "kind": "text",
      "title": "Which language would best serve your pastors?",
      "description": "Optional. We can discuss available translations when you contact us.",
      "label": "Language for training",
      "placeholder": "The language your pastors use",
      "skipLabel": "Skip this detail"
    },
    "donor-interest": {
      "id": "donor-interest",
      "kind": "question",
      "title": "Which part of this mission is on your heart?",
      "description": "",
      "options": [
        {
          "value": "launches",
          "label": "Launching national evangelism initiatives"
        },
        {
          "value": "scholarships",
          "label": "Scholarships for pastors and ministry leaders"
        },
        {
          "value": "translation",
          "label": "Translating courses into the languages of the Church"
        },
        {
          "value": "technology",
          "label": "Tools to coordinate prayer and Gospel outreach"
        },
        {
          "value": "general",
          "label": "Where the ministry need is greatest"
        }
      ]
    },
    "donor-partner": {
      "id": "donor-partner",
      "kind": "question",
      "title": "How would you like to support this work?",
      "description": "",
      "options": [
        {
          "value": "personal",
          "label": "Through a personal or family gift"
        },
        {
          "value": "church",
          "label": "Through our church’s missions giving"
        },
        {
          "value": "foundation",
          "label": "Through a foundation or ministry organization"
        },
        {
          "value": "strategic",
          "label": "By helping fund a major ministry initiative"
        },
        {
          "value": "exploring",
          "label": "I would like to learn more before deciding"
        }
      ]
    },
    "donor-help": {
      "id": "donor-help",
      "kind": "question",
      "title": "What would you like to understand before giving?",
      "description": "",
      "note": "Ready to give? Select the last option to see how to make your gift.",
      "options": [
        {
          "value": "model",
          "label": "How i2 equips the Church to reach Muslims"
        },
        {
          "value": "program",
          "label": "The work I would be helping to support"
        },
        {
          "value": "stewardship",
          "label": "How i2 stewards the gifts entrusted to it"
        },
        {
          "value": "talk",
          "label": "I would like to speak with someone at i2"
        },
        {
          "value": "give",
          "label": "I am ready to make a gift"
        }
      ]
    },
    "donor-stage": {
      "id": "donor-stage",
      "kind": "question",
      "title": "Where are you in considering this partnership?",
      "description": "",
      "options": [
        {
          "value": "exploring",
          "label": "I am learning about the ministry"
        },
        {
          "value": "soon",
          "label": "I hope to support the work soon"
        },
        {
          "value": "ready",
          "label": "I am ready to make a commitment"
        },
        {
          "value": "existing",
          "label": "I already give to i2 Ministries"
        }
      ]
    },
    "church-goal": {
      "id": "church-goal",
      "kind": "question",
      "title": "What would help your church reach Muslims for Christ?",
      "description": "",
      "options": [
        {
          "value": "foundations",
          "label": "Ground our people in the Gospel and an understanding of Islam"
        },
        {
          "value": "trainers",
          "label": "Prepare faithful leaders who will train others"
        },
        {
          "value": "mobilize",
          "label": "Put prayer, evangelism, and discipleship into practice"
        },
        {
          "value": "coordinate",
          "label": "Organize and follow up the outreach already underway"
        }
      ]
    },
    "church-role": {
      "id": "church-role",
      "kind": "question",
      "title": "How do you serve in your church?",
      "description": "",
      "options": [
        {
          "value": "pastor",
          "label": "Pastor or senior church leader"
        },
        {
          "value": "missions",
          "label": "Missions or evangelism leader"
        },
        {
          "value": "trainer",
          "label": "Bible teacher or ministry trainer"
        },
        {
          "value": "member",
          "label": "Church member bringing resources to our leaders"
        }
      ]
    },
    "church-stage": {
      "id": "church-stage",
      "kind": "question",
      "title": "How is your church currently ministering to Muslims?",
      "description": "",
      "options": [
        {
          "value": "new",
          "label": "We are preparing to begin"
        },
        {
          "value": "some",
          "label": "We have some training and want to put it into practice"
        },
        {
          "value": "active",
          "label": "We are reaching Muslims and raising up leaders"
        },
        {
          "value": "unsure",
          "label": "We are seeking direction for this work"
        }
      ]
    },
    "church-next": {
      "id": "church-next",
      "kind": "question",
      "title": "How can we help you equip your congregation?",
      "description": "",
      "options": [
        {
          "value": "free",
          "label": "Begin with free training for our people"
        },
        {
          "value": "compare",
          "label": "Review the training available to our church"
        },
        {
          "value": "talk",
          "label": "Speak with i2 about our congregation"
        },
        {
          "value": "recommend",
          "label": "Show us where to begin with our ministry needs"
        }
      ]
    },
    "learner-goal": {
      "id": "learner-goal",
      "kind": "question",
      "title": "For which area of ministry are you seeking preparation?",
      "description": "",
      "options": [
        {
          "value": "understand",
          "label": "Understand Islam and answer Muslim questions"
        },
        {
          "value": "share",
          "label": "Share the Gospel and disciple those who come to Christ"
        },
        {
          "value": "train",
          "label": "Teach and equip others for ministry among Muslims"
        },
        {
          "value": "study",
          "label": "Pursue deeper study in theology, Islam, and apologetics"
        }
      ]
    },
    "learner-experience": {
      "id": "learner-experience",
      "kind": "question",
      "title": "What preparation have you had for ministry among Muslims?",
      "description": "",
      "options": [
        {
          "value": "new",
          "label": "I am beginning this study"
        },
        {
          "value": "some",
          "label": "I have some training or experience in ministry"
        },
        {
          "value": "experienced",
          "label": "I already teach or minister and want to deepen my study"
        },
        {
          "value": "unsure",
          "label": "I would appreciate guidance on where to begin"
        }
      ]
    },
    "learner-format": {
      "id": "learner-format",
      "kind": "question",
      "title": "What kind of study are you seeking?",
      "description": "",
      "options": [
        {
          "value": "free",
          "label": "Free video teaching I can study at my own pace"
        },
        {
          "value": "advanced",
          "label": "Structured study in Christian missions and Islam"
        },
        {
          "value": "degree",
          "label": "Information about the master’s degree pathway"
        },
        {
          "value": "compare",
          "label": "Help choosing the right course of study"
        }
      ]
    },
    "learner-next": {
      "id": "learner-next",
      "kind": "question",
      "title": "How would you like to proceed with your training?",
      "description": "",
      "options": [
        {
          "value": "browse",
          "label": "Read about the training you recommend"
        },
        {
          "value": "compare",
          "label": "Review all the training available through i2"
        },
        {
          "value": "talk",
          "label": "Speak with i2 about my studies"
        }
      ]
    }
  },
  "results": {
    "result-initiative": {
      "title": "A plan to reach Muslims through the local church.",
      "description": "The Every Muslim for Christ Initiative brings churches together for prayer, training, evangelism, and discipleship. Learn how national leaders equip pastors, and pastors mobilize their congregations to reach Muslims for Christ.",
      "primary": {
        "label": "Read the Initiative strategy",
        "url": "/the-initiative"
      },
      "secondary": {
        "label": "Speak with i2 about the Initiative",
        "url": "/contact?topic=initiative#contact-form"
      }
    },
    "result-initiative-talk": {
      "title": "Let us discuss the work in your churches.",
      "description": "Tell us about the churches you serve and your vision for reaching Muslims. We would welcome a conversation about training your pastors and putting the Every Muslim for Christ Initiative into practice.",
      "primary": {
        "label": "Contact i2 about your churches",
        "url": "/contact?topic=initiative#contact-form"
      },
      "secondary": {
        "label": "Read the Initiative strategy first",
        "url": "/the-initiative"
      }
    },
    "result-requirements": {
      "title": "Preparing to launch the Initiative.",
      "description": "Begin with the Every Muslim for Christ strategy for prayer, training, evangelism, and discipleship. Then speak with i2 about the responsibilities and preparations involved for the churches you lead.",
      "primary": {
        "label": "Read about launching the Initiative",
        "url": "/the-initiative"
      },
      "secondary": {
        "label": "Discuss launching the Initiative",
        "url": "/contact?topic=initiative#contact-form"
      }
    },
    "result-wise": {
      "title": "Coordinate the work of the Great Commission.",
      "description": "WISE Global helps church and denominational leaders coordinate prayer, training, evangelism, and discipleship. See how this ministry tool serves the churches and leaders carrying that work forward.",
      "primary": {
        "label": "See how WISE serves the Church",
        "url": "/wise-global"
      },
      "secondary": {
        "label": "Read the Initiative strategy",
        "url": "/the-initiative"
      }
    },
    "result-training": {
      "title": "Equip the Church for faithful witness.",
      "description": "Review i2’s training in the Gospel, Islam, evangelism, and apologetics. Consider what will best serve your congregation, your students, or your own preparation for ministry.",
      "primary": {
        "label": "View ministry training",
        "url": "/get-trained"
      },
      "secondary": {
        "label": "Ask i2 about training",
        "url": "/contact?topic=training#contact-form"
      }
    },
    "result-free": {
      "title": "Begin with free teaching for ministry.",
      "description": "WADI offers free video teaching to help Christians understand Islam and bear witness to Christ. Visit our training page to find the courses and begin studying on your own or with your church.",
      "primary": {
        "label": "Find free ministry training",
        "url": "/get-trained"
      },
      "secondary": {
        "label": "Read about MMWU",
        "url": "/mmwu"
      }
    },
    "result-mmwu": {
      "title": "Study Christian missions, Islam, and apologetics.",
      "description": "Mission Muslim World University prepares pastors, teachers, and missionaries through sustained study of Christian missions to Muslims and Islamic studies. Continue to MMWU for the curriculum, training of trainers, and enrollment. It opens in a new window.",
      "primary": {
        "label": "Continue to MMWU",
        "url": "https://www.gommwu.org",
        "external": true
      },
      "secondary": {
        "label": "Ask about MMWU enrollment",
        "url": "/contact?topic=mmwu#contact-form"
      }
    },
    "result-scholarship": {
      "title": "Help prepare those who will equip the Church.",
      "description": "A scholarship helps a pastor or ministry leader study through Mission Muslim World University and prepare to train others. Read how you can help make this training available to those serving on the field.",
      "primary": {
        "label": "Read about MMWU scholarships",
        "url": "/mmwu"
      },
      "secondary": {
        "label": "Discuss supporting a student",
        "url": "/contact?topic=giving#contact-form"
      }
    },
    "result-giving": {
      "title": "Partner in taking the Gospel to Muslims.",
      "description": "Your giving can help train pastors, translate teaching, equip local churches, and support national evangelism initiatives. Read about the ministry needs and how you can share in this work.",
      "primary": {
        "label": "See where your gift can serve",
        "url": "/donate"
      },
      "secondary": {
        "label": "Speak with i2 about giving",
        "url": "/contact?topic=giving#contact-form"
      }
    },
    "result-stewardship": {
      "title": "Faithful stewardship of gifts entrusted to us.",
      "description": "We understand the responsibility of giving for the Lord’s work. Read how i2 approaches financial accountability and uses gifts to serve the Great Commission, then contact us with any questions.",
      "primary": {
        "label": "Read about financial stewardship",
        "url": "/donate#stewardship"
      },
      "secondary": {
        "label": "Ask i2 about stewardship",
        "url": "/contact?topic=giving#contact-form"
      }
    },
    "result-giving-talk": {
      "title": "Let us discuss a partnership in the Gospel.",
      "description": "Tell us about the work you wish to support and the partnership you are considering. We would welcome a conversation about serving denominational leaders, equipping pastors, and helping churches reach Muslims for Christ.",
      "primary": {
        "label": "Contact i2 about giving",
        "url": "/contact?topic=giving#contact-form"
      },
      "secondary": {
        "label": "Read about current ministry needs",
        "url": "/donate"
      }
    },
    "result-give": {
      "title": "Give to the work of the Great Commission.",
      "description": "Thank you for your willingness to stand with this ministry. Continue to the giving page to choose how you would like to make your gift.",
      "primary": {
        "label": "Continue to giving",
        "url": "/donate-form"
      },
      "secondary": {
        "label": "Read about financial stewardship",
        "url": "/donate#stewardship"
      }
    },
    "result-training-talk": {
      "title": "Let us hear about your training needs.",
      "description": "Tell us whom you are preparing for ministry and what you want them to learn. Our team can discuss the teaching and resources available for your church, your students, or your own ministry.",
      "primary": {
        "label": "Contact i2 about training",
        "url": "/contact?topic=training#contact-form"
      },
      "secondary": {
        "label": "View ministry training",
        "url": "/get-trained"
      }
    },
    "result-enrollment": {
      "title": "Discuss your studies with MMWU.",
      "description": "Tell us about your ministry experience and the study you hope to pursue. Contact i2 with questions about the curriculum, enrollment, or the master’s degree pathway.",
      "primary": {
        "label": "Ask about studying at MMWU",
        "url": "/contact?topic=mmwu#contact-form"
      },
      "secondary": {
        "label": "Read about the MMWU curriculum",
        "url": "/mmwu"
      }
    }
  },
  "branches": {
    "network": {
      "label": "Denominational leaders",
      "questions": [
        "goal",
        "network-role",
        "network-reach",
        "network-support",
        "network-stage",
        "network-next"
      ]
    },
    "donor": {
      "label": "Partners in the Gospel",
      "questions": [
        "goal",
        "donor-interest",
        "donor-partner",
        "donor-help",
        "donor-stage"
      ]
    },
    "church": {
      "label": "Pastors & congregations",
      "questions": [
        "goal",
        "church-goal",
        "church-role",
        "church-stage",
        "church-next"
      ]
    },
    "learner": {
      "label": "Theological study & ministry",
      "questions": [
        "goal",
        "learner-goal",
        "learner-experience",
        "learner-format",
        "learner-next"
      ]
    }
  }
};

  function recommend(a) {
    switch(a.goal) {
      case 'network':
        if (a['network-next'] === 'talk') return 'result-initiative-talk';
        if (a['network-next'] === 'requirements') return 'result-requirements';
        if (a['network-next'] === 'plan') return 'result-initiative';
        if (a['network-next'] === 'training') return a['network-support'] === 'trainers' ? 'result-mmwu' : 'result-training';
        if (a['network-support'] === 'coordination') return 'result-wise';
        if (a['network-support'] === 'trainers') return 'result-mmwu';
        return 'result-initiative';
      case 'donor':
        if (a['donor-help'] === 'give') return 'result-give';
        if (a['donor-help'] === 'talk') return 'result-giving-talk';
        if (a['donor-help'] === 'stewardship') return 'result-stewardship';
        if (a['donor-help'] === 'model') return 'result-initiative';
        return {launches:'result-initiative', scholarships:'result-scholarship', technology:'result-wise'}[a['donor-interest']] || 'result-giving';
      case 'church':
        if (a['church-next'] === 'free') return 'result-free';
        if (a['church-next'] === 'compare') return 'result-training';
        if (a['church-next'] === 'talk') return a['church-goal'] === 'mobilize' ? 'result-initiative-talk' : 'result-training-talk';
        if (a['church-goal'] === 'coordinate') return 'result-wise';
        if (a['church-goal'] === 'mobilize') return 'result-initiative';
        if (a['church-goal'] === 'trainers') return 'result-mmwu';
        return a['church-stage'] === 'new' ? 'result-free' : 'result-training';
      case 'learner': {
        const advanced = ['advanced','degree'].includes(a['learner-format']);
        if (a['learner-next'] === 'talk') return advanced ? 'result-enrollment' : 'result-training-talk';
        if (a['learner-next'] === 'compare') return 'result-training';
        if (a['learner-format'] === 'free') return 'result-free';
        if (advanced) return 'result-mmwu';
        return 'result-training';
      }
      default: return 'result-training';
    }
  }
  data.recommend = recommend;
  root.I2Pathfinder = data;
})(window);
