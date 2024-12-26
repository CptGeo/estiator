package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.Table;

import java.util.List;

public interface ITableService {
    public Table save(Table table);
    public List<Table> get();
    public Table get(int id);
    public void delete(int id);
}
