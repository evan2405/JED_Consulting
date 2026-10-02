import Courses from './Courses'
import FAQ from './FAQ'
import Banner from './Banner'
import Services from './Services'
import Submissions from './Submissions'
import AuditEvent from './AuditEvent'
import {extraContentTypes} from './Content'
export const contentTypes = [Courses, Banner, FAQ, Services, ...extraContentTypes]
export const enquiryTypes = [Submissions, AuditEvent]
export const schemaTypes = contentTypes
