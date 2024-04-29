'''
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

'''

















system = 1
def getCurrentInventory(self, partnumber):
    queryLocations = "SELECT * FROM locations"
    
    sql_pt_relation = '''
        SELECT id_relation, PP_InventoryPartnumber.id_partnumber, PP_InventoryPartnumber.partnumber, T1.Description as Description_Partnumber, PP_InventoryPartnumber.partnumber_inv, T2.Description as Description_Partnumber_Inv
        FROM PP_InventoryPartnumber
        INNER JOIN PP_Partnumbers as T1 ON T1.Partnumber = PP_InventoryPartnumber.partnumber
        INNER JOIN PP_Partnumbers as T2 ON T2.Partnumber = PP_InventoryPartnumber.partnumber_inv
        WHERE PP_InventoryPartnumber.partnumber = ?
    '''

    sql_inv_actual = '''
        SELECT DISTINCT locations.location, partnumber.partnumber, partnumber.description, PP_InventariosActuales.QtyOnHand, PP_InventariosActuales.Username, PP_InventariosActuales.Timestamp
        FROM PP_InventariosActuales
        INNER JOIN locations ON PP_InventariosActuales.Location = locations.location
        INNER JOIN partnumber ON PP_InventariosActuales.ItemNumber = partnumber.partnumber
        INNER JOIN c_line ON partnumber.id_line = c_line.id_line
        WHERE partnumber.partnumber IN({partnumbers}) 
    '''
                        
    #locationDataset = system.db.runPrepQuery(queryLocations, [partnumber])
    locationDataset = system.db.runQuery(queryLocations)
    
    CountPartnumberLocations = len(locationDataset)
    locations =  locationDataset.getColumnAsList(1)

    datasetPartnumberInventoryRelation = system.db.runPrepQuery(sql_pt_relation, [partnumber])

    #datalistPartnumberInventoryRelation = system.dataset.toPyDataSet(datasetPartnumberInventoryRelation)
    #CountPartnumberInventoryRelation = len(datalistPartnumberInventoryRelation)

    InvActu = 0
    if len(datasetPartnumberInventoryRelation) != 0:

        partnumbers =  datasetPartnumberInventoryRelation.getColumnAsList(4)
        partnumbersString = ", ".join("'{}'".format(pt) for pt in map(str, partnumbers))

        sql_inv_actual = sql_inv_actual.replace('{partnumbers}', partnumbersString)

        datasetInventory = system.db.runPrepQuery(sql_inv_actual,[])
  
        countInventory = len(datasetInventory)
        for row in range(0, countInventory):
            InvActu += datasetInventory.getValueAt(row, 'QtyOnHand')
    else:
        sql_inv_actual = sql_inv_actual.replace('{partnumbers}', partnumber)
        datasetInventory = system.db.runPrepQuery(sql_inv_actual,[])

        countInventory = len(datasetInventory)
        
        if countInventory != 0 and CountPartnumberLocations != 0:
            for row in range(0, countInventory):
                location = datasetInventory.getValueAt(row, 'location')
                if location in locations:
                    InvActu += datasetInventory.getValueAt(row, 'QtyOnHand')
        elif countInventory != 0 and CountPartnumberLocations == 0:
            InvActu = datasetInventory.getValueAt(0, 'QtyOnHand')
        else:
            InvActu = 0
    return InvActu
    