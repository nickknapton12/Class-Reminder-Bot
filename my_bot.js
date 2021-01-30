const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login("ODAxNjY2NjQxODI5NjkxNDAy.YAkAPQ.ZkvEpO61DWlXw4yG6QXvLsub17c")

let servers = []; //Array of servers
let notificationUsers = []; // list of users
let events = []; // This will be array of events
let signUpChannel = '803791742621057024';
let submitRemindersChannel = '804205655351099393';
let approveRemindersChannel = '804205523091849236';
var signUpMessageId = '';


//database stuff
const fs = require('fs') //importing file save
var xpPathUserData = 'userData.json'
var xpReadUserData = fs.readFileSync(xpPathUserData);
var xpFileUserData = JSON.parse(xpReadUserData); //ready for use

var xpPathReminders = 'notifications.json'
var xpReadReminders = fs.readFileSync(xpPathReminders);
var xpFileReminders = JSON.parse(xpReadReminders);



client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    console.log(client.channels.name);

    client.user.setActivity("GME stock", {type: 'WATCHING'}) // fix

    let generalChannel = client.channels.cache.get("802294668913410132")
    const now = new Date();
    console.log(now.getHours());

    const signUpMes = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sign up sheet')
        .setDescription('This is the sign up sheet for CoronaTimes class reminders! \n\nHave you ever found yourself trying to cram for a assignment or test that snuck up on you too fast? \n\nThats where I come in, Daily reminders in the morning via DM of assignments due in the future, tests coming up or any other important events coming up! \n\nSimply signup and react to the classes you are in. To unsubscribe simply un react to the message! \n\nUsers can use the request-reminder channel submit reminders for a class using the specified format. \n\n Please feel free to DM the creator @CoronaTime if you have any problems or to request new features!!')
        .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
        .addFields(
            { name: 'React: 🍺', value: 'To Sign Up!'},
            { name: 'React: 0️⃣', value: 'For ENSF 409', inline:true},
            { name: 'React: 1️⃣', value: 'For ENCM 369', inline:true},
            { name: 'React: 2️⃣', value: 'For ENEL 327', inline:true},
            { name: 'React: 3️⃣', value: 'For Math 271', inline:true},
            { name: 'React: 4️⃣', value: 'For CPSC 319', inline:true},
            { name: 'React: 5️⃣', value: 'For BMEN 309', inline:true},
            { name: 'React: 6️⃣', value: 'For COMS 363', inline:true},
            { name: 'React: 7️⃣', value: 'For ENGG 209', inline:true},
            { name: 'React: 8️⃣', value: 'For ENGG 481', inline:true}
        )
        .setFooter('Disclamer: This is in no way a substitute for not knowing when things are due. This is only a additional tool to remind you when a class has something due. If you miss an assignment because my bot did not remind you it is in no way my responsibility, by signing up you agree to this.');
    let signUpChan = client.channels.cache.get(signUpChannel);
    signUpChan.send(signUpMes).then(signUpMes => {
        signUpMes.react('🍺');
        signUpMes.react('0️⃣');
        signUpMes.react('1️⃣');
        signUpMes.react('2️⃣');
        signUpMes.react('3️⃣');
        signUpMes.react('4️⃣');
        signUpMes.react('5️⃣');
        signUpMes.react('6️⃣');
        signUpMes.react('7️⃣');
        signUpMes.react('8️⃣');
        signUpMessageId = signUpMes.id;
    });

    const requestMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('HOW TO USE')
        .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
        .setDescription('To submit a request for a class notification please follow the format below carefully or it will not be aproved, request will auto delete after sending, DO NOT resend, this is normal. After the request is approved it will be added to the upcoming events for that class and so long as your signed up you will recieve daily reminders until its over.')
        .addField('Template:', '!remind [CLASSNAME] [EVENT] [MONTH NUMBER] [DAY NUMBER] [24 HOUR NUMBER] [MINUTE NUMBER] [EITHER AM OR PM]')
        .addField('Example for ENSF409 assignment 2 thats due on january 1st at 3:30pm', '!remind ENSF409 Assignment2 1 1 3 30 pm')
        .addField('IMPORTANT NOTES:', '1) Write the Class in all caps and no space between course code eg. ENSF409 or ENCM369 or CPSC319  \n\n 2) The Event also should have no spaces in it, for assignment 1, write: Assignment1. For Test 2, write: Test2, however caps doesnt matter for this field.  \n\n3) The month, day, hour, and minutes should all be numbers!  \n\n 4) The hour MUST be in 24 version for now! \n\n5) The last field simply write "am" or "pm"');

    let reqChan = client.channels.cache.get(submitRemindersChannel);
    reqChan.send(requestMessage);

    cacheMembers();
    loadData();

    //var theServer = client.guilds.cache.get('802294668913410129');
    //theServer.members.cache.find( user => user.id == notificationUsers[0].user.id).send("Test").then(summary => {
    //    summary.react('✅');
    //})

    //console.log(notificationUsers[0].user.id)
    //client.users.cache.find(user => user.id == notificationUsers[0].user.id).send("Test").then(summary => {
    //    summary.react('✅');
    //})
})

function cacheMembers(){
    //client.channels.cache.find('804205655351099393').cache.uses.find()
}

function loadData(){
    for(let i = 0; i < xpFileUserData.Users.notificationUsers.length; i++){
        var proccessUser = 0;
        notificationUsers.push(xpFileUserData.Users.notificationUsers[i]);
        console.log(notificationUsers[i]);
    }

    for(let i = 0; i < xpFileReminders.Reminders.events.length; i++){
        var proccessReminder = new reminder(xpFileReminders.Reminders.events[i].theClass, xpFileReminders.Reminders.events[i].theReminder, xpFileReminders.Reminders.events[i].theMonth, xpFileReminders.Reminders.events[i].theDay, xpFileReminders.Reminders.events[i].theHour, xpFileReminders.Reminders.events[i].theMinutes, xpFileReminders.Reminders.events[i].theAmOrPm,xpFileReminders.Reminders.events[i].theAuthor);

        events.push(proccessReminder);
        console.log(events[i]);
    }
}

client.on('messageReactionAdd', (reaction, user) => {
    if(user == client.user){
        return
    }
    if(reaction.message.author != client.user){
        return
    }
    if(reaction.message.id == signUpMessageId){

        if(reaction.emoji.name == '0️⃣' ){ // ENSF 409
            addUserSubscription(user, 'ENSF409')
        }

        if(reaction.emoji.name == '1️⃣' ){ // ENCM 369
            addUserSubscription(user, 'ENCM369')
        }

        if(reaction.emoji.name == '2️⃣' ){ // ENEL 327
            addUserSubscription(user, 'ENEL327')
        }

        if(reaction.emoji.name == '3️⃣' ){
            addUserSubscription(user, 'MATH271')
        }

        if(reaction.emoji.name == '4️⃣' ){//803802935267164160
            addUserSubscription(user, 'CPSC319')
        }

        if(reaction.emoji.name == '5️⃣' ){
            addUserSubscription(user, 'BMEN309')
        }

        if(reaction.emoji.name == '6️⃣' ){
            addUserSubscription(user, 'COMS363');
        }

        if(reaction.emoji.name == '7️⃣' ){
            addUserSubscription(user, 'ENGG209');
        }

        if(reaction.emoji.name == '8️⃣' ){
            addUserSubscription(user, 'ENGG481');
        }

        if(reaction.emoji.name == '🍺' ){
            addUser(user);
        }
        return
    }

    if(reaction.message.channel == approveRemindersChannel){
        if(reaction.emoji.name == '✅'){
            var comps = reaction.message.content.split("\n");
            sendAprovedNotice(comps);
            var newReminder = new reminder(comps[0] ,comps[1], comps[2], comps[3], comps[4], comps[5], comps[6], comps[7]); 
            events.push(newReminder);

            xpFileReminders["Reminders"] = {events}; //if not, create it
            fs.writeFileSync(xpPathReminders, JSON.stringify(xpFileReminders, null, 2));

            reaction.message.delete();
        }
    }

    if(reaction.message.channel == approveRemindersChannel){
        if(reaction.emoji.name == '❌'){
            var comps = reaction.message.content.split("\n");
            sendNotAprovedNotice(comps);
            reaction.message.delete();
        }
    }

    if(reaction.message.channel != approveRemindersChannel)
    if(reaction.emoji.name == '✅'){
        reaction.message.delete();
    }

    return

})

client.on('messageReactionRemove', (reaction, user) => { // For removing notifications.

    if(reaction.message.id == signUpMessageId){
        if(reaction.emoji.name == '0️⃣' ){ // ENSF 409
            console.log('pass');
            removeUserSubscription(user, 'ENSF409')
        }

        if(reaction.emoji.name == '1️⃣' ){ // ENCM 369
            removeUserSubscription(user, 'ENCM369')
        }

        if(reaction.emoji.name == '2️⃣' ){ // ENEL 327
            removeUserSubscription(user, 'ENEL327')
        }

        if(reaction.emoji.name == '3️⃣' ){
            removeUserSubscription(user, 'MATH271')
        }

        if(reaction.emoji.name == '4️⃣' ){//803802935267164160
            removeUserSubscription(user, 'CPSC319')
        }

        if(reaction.emoji.name == '5️⃣' ){
            removeUserSubscription(user, 'BMEN309')
        }

        if(reaction.emoji.name == '6️⃣' ){
            removeUserSubscription(user, 'COMS363')
        }

        if(reaction.emoji.name == '7️⃣' ){
            removeUserSubscription(user, 'ENGG209')
        }

        if(reaction.emoji.name == '8️⃣' ){
            removeUserSubscription(user, 'ENGG481')
        }
    }

    return
})

client.on('message', message => {
    if(message.author == client.user){
        return
    }
    if(message.channel == submitRemindersChannel){ // submitting request channel
        if(message.content.startsWith('!')){ // This will be for submitting reminders
        
            if(message.content.substring(0,7) == '!remind'){
                var event = message.content.substring(8);
                var commands = event.split(" ");
                commands.push(message.author.id)

                console.log(commands.length)
                if(commands.length == 8){
                    notificationRequest(commands);
                }else{
                   sendWrongFormatNotice(commands); 
                }
                
                
                message.delete();
            }        
        }
        if(message.author != '301384462153809921'){
            message.delete();
        }
    }
   return
})

function sendWrongFormatNotice(comps){
    let notApprovedMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Reminder Request Denied')
    .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
    .setDescription('Your Reminder request has been auto filtered out for not being in the right format, if you think this is an error please contact CoronaTime!')
    .setFooter("React with checkmark to delete");

    client.users.cache.find(user => user.id == comps[8]).send(notApprovedMessage).then(summary => {
        summary.react('✅');
    })
}

function sendNotAprovedNotice(comps){
    let deniedMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Reminder Request Denied')
    .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
    .setDescription('Your Reminder request for ' + comps[0] + ' ' + comps[1] + ' has been denied, if you think this is an error please contact CoronaTime!')
    .setFooter("React with checkmark to delete");

    client.users.cache.find(user => user.id == comps[8]).send(deniedMessage).then(summary => {
        summary.react('✅');
    })
}

function sendAprovedNotice(comps){
    let approveMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Reminder Request Approved')
    .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
    .setDescription('Your Reminder request for ' + comps[0] + ' ' + comps[1] + ' has been approved!')
    .setFooter("React with checkmark to delete");

    client.users.cache.find(user => user.id == comps[7]).send(approveMessage).then(summary => {
        summary.react('✅');
    })
}

function notificationRequest(commands){ // should send mods a message in a mod group chat asking if this is ok and if any mod reacts with a checkmark then the reminder should be created and added to events
    const requestChannel = client.channels.cache.get(approveRemindersChannel);
    requestChannel.send(commands).then(sentcommands => {
        sentcommands.react('✅');
        sentcommands.react('❌');
    })
}

function addUser(user){
    for(let i = 0; i < notificationUsers.length; i++){
        if(notificationUsers[i].user.id == user.id){
            return
        }
    }


    var userName = user.username //user id here

    //if (!xpFileUserData[0][userName]) { //this checks if data for the user has already been created
   //     xpFileUserData[userName] = {userInfo : user, subscriptions: ""}; //if not, create it
    //    fs.writeFileSync(xpPathUserData, JSON.stringify(xpFileUserData, null, 2));
    //}

    let newUser = new aUser(user);
    notificationUsers.push(newUser);

    xpFileUserData["Users"] = {notificationUsers}; //if not, create it
    fs.writeFileSync(xpPathUserData, JSON.stringify(xpFileUserData, null, 2));

    console.log(notificationUsers[notificationUsers.length - 1].user)
    return;
}

class aUser{
    constructor(user){
        this.user = user;
        this.subscriptions = [];
    }
}

function addUserSubscription(user, subscription){
    for(let i = 0; i < notificationUsers.length; i++){
        if(notificationUsers[i].user.id == user.id){
            for(let j = 0; j < notificationUsers[i].subscriptions.length; j++){
                if(notificationUsers[i].subscriptions[j] == subscription){
                    return;
                }
            }
            notificationUsers[i].subscriptions.push(subscription);

            xpFileUserData[xpFileUserData.Users.notificationUsers[i]] = {subscriptions : notificationUsers[i].subscriptions};
            fs.writeFileSync(xpPathUserData, JSON.stringify(xpFileUserData, null, 2));

            return
        }
    }



    let pleaseSignUpFirstMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Please Sign Up First')
    .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
    .setDescription('Hey ' + user.username + ", please sign up first by reacting to the signup sheet with a 🍺, then un-react and re-react to the class you want to join!")
    .setFooter("React with checkmark to delete");

    user.send(pleaseSignUpFirstMessage).then(summary => {
        summary.react('✅');
    });
}

function removeUserSubscription(user, subscription){ // Will be for removing subscriptions could also put in aUser
    for(let i = 0; i < notificationUsers.length; i++){
        if(notificationUsers[i].user.id == user.id){
            for(let j = 0; j < notificationUsers[i].subscriptions.length; j++){
                console.log("there");
                if(notificationUsers[i].subscriptions[j] == subscription){
                    console.log("here");
                    notificationUsers[i].subscriptions.splice(j, 1);
                }
            }
        }
    }
}

class reminder{
    constructor(theClass, theReminder, month, day, hour, minutes, amOrPm, Author){
        this.theAuthor = Author;
        this.theMonth = month;
        this.theDay = day;
        this.theHour = hour;

        this.theRightMonth = month - 1;

        this.theMinutes = minutes;
        this.theAmOrPm = amOrPm
        this.theClass = theClass;
        this.theReminder = theReminder;

        console.log(month);


        this.dueDate = new Date(2021, month - 1, day, hour, minutes, 0 ,0);  
        this.thedate = new Date(2021, month - 1, day, hour, minutes, 0, 0).getTime();


        console.log(this.thedate);
        console.log('created reminder')
    }

    sendReminder(){
        for(let i = 0; i < notificationUsers.length; i++){
           for(let j = 0; j < notificationUsers[i].subscriptions.length; j++){
               if(notificationUsers[i].subscriptions[j] == this.theClass){
                    console.log('Sending ' + notificationUsers[i].user.toString() + " " + this.theClass + " notification");
                    
                    var summary = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(this.theClass + " " + this.theReminder)
                        .setAuthor('CoronaTime', 'https://assets.prucenter.com/brew-images/_639x639_crop_center-center_none/corona.jpg?mtime=20180403160236&focal=none')
                        .setDescription("Due: " + this.dueDate.toDateString() + " at " + this.theHour + ":" + this.theMinutes)
                        .setFooter("React with checkmark to delete");

                    console.log(notificationUsers[i].user.id);
                    //let user = client.guild.members.cache.get(notificationUsers[i].user);
                    notificationUsers[i].user.send(summary).then(summary => {
                        summary.react('✅');
                    })
                    //console.log(userToSend);
                    //userToSend.send(summary).then(summary => {
                    //    summary.react('✅');
                    //})
                }
           }
        }
    }
}

function checkForFinishedEvents(){ // Check if any event in the events list is over every day
    var refDate = new Date().getTime();
    for(let i = 0; i < events.length; i++){
        if(events[i].thedate < refDate){
            events.splice(i, 1);
            console.log("reminder removed");
        }
    }
}

setInterval( function() { // sends a daily reminder to all reminders in the events array
    checkForFinishedEvents();
    for(let i = 0; i < events.length; i++){
       events[i].sendReminder();
    }
}, 10000) //86400000 is 1 day
