(function (root) {
  'use strict';

  // Role and intent stay in memory. Only the chosen destination leaves this page.
  root.I2Pathfinder = {
    network: {
      title: 'I lead a denomination or network',
      description: 'Equip churches across a region or nation.',
      question: 'What would help your network move forward?',
      options: [
        { title: 'Explore launching an initiative', description: 'Talk about equipping and mobilizing your churches.', result: {
          title: 'Mobilize your church network.',
          description: 'The Every Muslim for Christ Initiative helps denominational leaders equip trainers, activate churches, and sustain the work through coaching and WISE.',
          points: ['National and regional launch planning', 'Training your leaders to train others', 'Ongoing coaching and ministry coordination'],
          primary: ['Talk with the i2 team', '/contact?topic=initiative#contact-form'],
          secondary: ['Explore the initiative', '/the-initiative']
        } },
        { title: 'Understand the ministry model', description: 'See how national leadership equips local churches.', result: {
          title: 'See how the initiative multiplies.',
          description: 'Start with the Every Muslim for Christ Initiative: how i2 partners with senior leaders, equips local trainers, and supports churches in prayer, evangelism, and discipleship.',
          primary: ['Explore the initiative', '/the-initiative'],
          secondary: ['Talk with the i2 team', '/contact?topic=initiative#contact-form']
        } },
        { title: 'Ready to register our denomination', description: 'Review the initiative’s ministry agreement.', result: {
          title: 'Take the next step toward a launch.',
          description: 'The EMFCI registration site explains the ministry agreement: developing certified trainers, running launch conferences, mobilizing local churches, and adopting WISE to track progress. Review those commitments before registering.',
          primary: ['Review the ministry agreement', 'https://www.i2ministries-emfci.com/'],
          secondary: ['Discuss the initiative with our team', '/contact?topic=initiative#contact-form']
        } },
        { title: 'Coordinate an existing outreach', description: 'Explore tools for teams and ministry progress.', result: {
          title: 'Support the work across your network.',
          description: 'WISE Global supports ministry coordination and progress across individuals, churches, and denominations. Explore how it fits your prayer, training, and outreach work.',
          primary: ['Explore WISE Global', '/wise-global'],
          secondary: ['Ask our team about implementation', '/contact?topic=partnership#contact-form']
        } }
      ]
    },
    donor: {
      title: 'I want to fund the mission',
      description: 'Explore giving and strategic partnerships.',
      question: 'How would you like to make an impact?',
      options: [
        { title: 'See where my gift can help', description: 'Explore country launches, scholarships, and technology.', result: {
          title: 'Fund the work that equips the Church.',
          description: 'Your partnership supports national launches, translated training, leadership scholarships, and ministry technology. See the opportunities and how i2 stewards ministry gifts.',
          primary: ['Explore giving opportunities', '/donate'],
          secondary: ['Talk with our team about giving', '/contact?topic=giving#contact-form']
        } },
        { title: 'Discuss a strategic or major gift', description: 'Talk about funding a country launch or ministry priority.', result: {
          title: 'Explore a strategic giving partnership.',
          description: 'Connect with the i2 team about national launches and other ministry priorities. The team can help you understand the work and discuss where your partnership could help.',
          primary: ['Talk about a strategic gift', '/contact?topic=giving#contact-form'],
          secondary: ['See the initiative you could help fund', '/the-initiative']
        } },
        { title: 'Help train a ministry leader', description: 'Learn about MMWU scholarships.', result: {
          title: 'Help equip a leader who can train others.',
          description: 'Mission Muslim World University develops leaders through advanced training. Explore its scholarship needs and how trained leaders serve their churches and networks.',
          primary: ['Explore MMWU scholarships', '/mmwu'],
          secondary: ['View giving options', '/donate']
        } },
        { title: 'I am ready to give', description: 'Go to the secure giving options.', result: {
          title: 'Partner with the mission.',
          description: 'Choose your preferred giving method. Payments are handled through i2’s existing giving providers.',
          primary: ['View giving options', '/donate-form'],
          secondary: ['Read about stewardship', '/donate#stewardship']
        } }
      ]
    },
    church: {
      title: 'I serve a local church or ministry',
      description: 'Prepare a team for ministry to Muslims.',
      question: 'What does your church or team need?',
      options: [
        { title: 'Training for our church or team', description: 'Find practical ways to get equipped.', result: {
          title: 'Equip your church for ministry.',
          description: 'Explore i2’s training pathways, including free video resources and advanced study. Find a starting point for your team and connect with i2 about your training needs.',
          primary: ['Explore training pathways', '/get-trained'],
          secondary: ['Ask about training for our team', '/contact?topic=training#contact-form']
        } },
        { title: 'A plan to mobilize our churches', description: 'Connect training with prayer and outreach.', result: {
          title: 'Turn training into church-wide action.',
          description: 'See how the Every Muslim for Christ Initiative connects leadership, training, prayer, evangelism, and discipleship. Then talk with the team about how your church can take part.',
          primary: ['Explore the initiative', '/the-initiative'],
          secondary: ['Talk about church participation', '/contact?topic=initiative#contact-form']
        } },
        { title: 'Tools to coordinate our outreach', description: 'Help our team organize and follow its progress.', result: {
          title: 'Coordinate your team with WISE.',
          description: 'Discover WISE Global’s approach to prayer, training, and ministry coordination for churches and outreach teams.',
          primary: ['Explore WISE Global', '/wise-global'],
          secondary: ['Explore training pathways', '/get-trained']
        } }
      ]
    },
    learner: {
      title: 'I want to learn and get equipped',
      description: 'Find free training or advanced study.',
      question: 'Where would you like to begin?',
      options: [
        { title: 'Free video training', description: 'Start learning at my own pace.', result: {
          title: 'Start with free training on WADI.',
          description: 'WADI offers free on-demand video training for Christians preparing for ministry to Muslims. Continue to the WADI website to explore the courses.',
          primary: ['Explore free training on WADI', 'https://thewadi.org'],
          secondary: ['Compare all training pathways', '/get-trained']
        } },
        { title: 'Advanced study and a degree pathway', description: 'Explore Mission Muslim World University.', result: {
          title: 'Take your training further with MMWU.',
          description: 'Explore MMWU’s graduate-level curriculum and its master’s degree pathway through God’s Bible School & College, including enrollment and scholarship information.',
          primary: ['Explore MMWU', '/mmwu'],
          secondary: ['Ask about enrollment', '/contact?topic=mmwu#contact-form']
        } },
        { title: 'Help choosing a starting point', description: 'Understand the available training options.', result: {
          title: 'Find a training path that fits.',
          description: 'Start with the training overview to compare free videos, advanced study, and ways to put what you learn into practice.',
          primary: ['See the training pathways', '/get-trained'],
          secondary: ['Learn about the mission', '/the-mission']
        } }
      ]
    }
  };
})(window);
