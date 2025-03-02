package com.kalyvianakis.estiator.io.dto;

public class TableAvailability {

    private Long id;

    private String label;

    private Integer capacity;

    private Integer x;

    private Integer y;

    private String color;

    private Boolean occupied;

    public TableAvailability(Long id, String label, Integer capacity, Integer x, Integer y, String color, Boolean occupied) {
        this.id = id;
        this.label = label;
        this.capacity = capacity;
        this.x = x;
        this.y = y;
        this.color = color;
        this.occupied = occupied;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getOccupied() {
        return occupied;
    }

    public void setOccupied(Boolean occupied) {
        this.occupied = occupied;
    }
}
