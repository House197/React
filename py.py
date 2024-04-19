params = {
	'PP_S1': 1,
	'PP_S2': 2,
	'PP_S3': 3,
    'id_partnumber': 2,
    'id_line': '',
    'date': 'TODAY',
    'is_simulation': 2,
}
def savePlan(self, params):
    PP_S1 = params['PP_S1']
    PP_S2 = params['PP_S2']
    PP_S3 = params['PP_S3']

    id_partnumber = params['id_partnumber']
    id_line = params['id_line']
    date = params['date']
    is_simulation = params['is_simulation']
    PP_tabla = 'PP_PlanProduction_sim' if is_simulation else 'PP_PlanProduction'
  
    PP_existQuery = system.db.runPrepQuery('SELECT COUNT(*) FROM ' + PP_tabla + ' WHERE id_line = ? AND id_partnumber = ? AND Date = ?',[id_line, id_partnumber, date])
    today = system.date.now()
    todayZero = system.date.setTime(today,0,0,0)
    yesterdayZero = system.date.addDays(todayZero,-1)


    if yesterdayZero == date and system.date.getHour24(today) < 7:
        paramsQuery = [PP_S3, id_line, id_partnumber, date]
        if PP_existQuery.getValueAt(0,0) > 0:
            query = 'UPDATE ' + PP_tabla + ' SET Turno3 = ? WHERE id_line = ? AND id_partnumber = ? AND Date = ?'
        else:
            query = 'INSERT INTO ' + PP_tabla + ' (Turno3, id_line, id_partnumber, Date) VALUES (?,?,?,?)'
    elif todayZero == date and system.date.getHour24(today) > 15 and system.date.getHour24(today) < 23:
        paramsQuery = [PP_S2, PP_S3, id_line, id_partnumber, date]
        if PP_existQuery.getValueAt(0,0) > 0:
            query = 'UPDATE ' + PP_tabla + ' SET Turno2 = ?, Turno3 = ? WHERE id_line = ? AND id_partnumber = ? AND Date = ?'
        else:
            query = 'INSERT INTO ' + PP_tabla + ' (Turno2, Turno3, id_line, id_partnumber, Date) VALUES (?,?,?,?,?)'
    elif date > today or (todayZero == date and system.date.getHour24(today) < 15):
        paramsQuery = [PP_S1, PP_S2, PP_S3, id_line, id_partnumber, date]
        if PP_existQuery.getValueAt(0,0) > 0:
            query = 'UPDATE ' + PP_tabla + ' SET Turno1 = ?, Turno2 = ?, Turno3 = ? WHERE id_line = ? AND id_partnumber = ? AND Date = ?'
        else:
            query = 'INSERT INTO ' + PP_tabla + ' (Turno1, Turno2, Turno3, id_line, id_partnumber, Date) VALUES (?,?,?,?,?,?)'
    else:
        paramsQuery = [PP_S1, PP_S2, PP_S3, id_line, id_partnumber, date]
        if PP_existQuery.getValueAt(0,0) > 0:
            query = 'UPDATE ' + PP_tabla + ' SET Turno1 = ?, Turno2 = ?, Turno3 = ? WHERE id_line = ? AND id_partnumber = ? AND Date = ?'
        else:
            query = 'INSERT INTO ' + PP_tabla + ' (Turno1, Turno2, Turno3, id_line, id_partnumber, Date) VALUES (?,?,?,?,?,?)'
            
    print query + ', ' +str(paramsQuery)
    system.db.runPrepUpdate(query,paramsQuery)
