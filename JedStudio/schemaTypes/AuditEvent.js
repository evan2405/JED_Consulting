export default {
  name: 'auditEvent',
  title: 'Access audit',
  type: 'document',
  readOnly: true,
  fields: [
    {name: 'actor', type: 'string'},
    {name: 'action', type: 'string'},
    {name: 'recordId', type: 'string'},
    {name: 'recordCount', type: 'number'},
    {name: 'dateFrom', type: 'string'},
    {name: 'dateTo', type: 'string'},
    {name: 'occurredAt', type: 'datetime'},
  ],
}
