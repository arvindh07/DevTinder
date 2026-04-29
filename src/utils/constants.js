const saltRounds = 10;

const states = ['ignored', 'interested', 'accepted', 'rejected'];

const stateConstants = {
    IGNORED: "ignored",
    INTERESTED: "interested",
    ACCEPTED: "accepted",
    REJECTED: "rejected"
}

module.exports = { saltRounds, states, stateConstants };