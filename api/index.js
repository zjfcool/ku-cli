import axios from '../utils/axios.js'
import { configStore } from '../utils/common.js'
const organization = configStore.get('organization') || 'aha-ku';
const fetchRepos = () => axios.get(`https://api.github.com/orgs/${organization}/repos`)
const fetchTags = (repo) => axios.get(`https://api.github.com/repos/${organization}/${repo}/tags`)
export {
    fetchRepos,
    fetchTags
}