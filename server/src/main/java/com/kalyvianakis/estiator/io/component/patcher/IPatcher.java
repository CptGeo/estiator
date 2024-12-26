package com.kalyvianakis.estiator.io.component.patcher;

public interface IPatcher<T> {
  public void patch(T existing, T incomplete);
}
