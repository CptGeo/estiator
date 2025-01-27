package com.kalyvianakis.estiator.io.component.patcher;

public interface IPatcher<T> {
  void patch(T existing, T incomplete);
}
